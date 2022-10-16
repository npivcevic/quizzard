import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Player } from '../model/player';
import { QuestionService } from '../question.service';
import { Question } from '../model/question';

@Injectable({
  providedIn: 'root'
})
export class QuizHostService {

  public groupName: string = "";
  public players: Player[] = [];
  public questions:Question[]=[]
  public currentquestion:Question={} as Question;
  public quizStarted: boolean = false
  public playerAnswer:string="";
  public playerId:string="";
  public curentQuestionIndex: number = -1
  public timeLeft: number = 100;
  public totalTimePerQuestion: number = 5000
  public x: number = Math.ceil(this.totalTimePerQuestion / this.timeLeft)
  public showingCorrectAnswer: boolean = false
  public nextQuestionDelay: number = 10000


  constructor(public signalRService: SignalrService, public questionservice: QuestionService) { }

  public async initialize() {
    await this.signalRService.startConnection();
    this.signalRService.hostQuiz();
    this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })

    this.questionservice.getQuestions()
    .subscribe(data => this.questions=data)

  }

  startQuiz() {
    this.quizStarted = true
    this.nextQuestion();
  }

  recordAnswer(playerId:string, answerId:string, questionId:string){
    this.players.forEach((player)=>{
      if(player.connectionId===playerId){
        player.submitedAnswers.push({
          questionId,
          answerId
        })
      }
    })
    
  }
  
  sendQuestiontoPlayer(){
    this.currentquestion=Object.assign({},this.questions[this.curentQuestionIndex])
    this.currentquestion.answers=this.questions[this.curentQuestionIndex].answers.map((answer)=>{
      return {
        id: answer.id,
        text: answer.text,
      }
    })
    const data = {
      action: "QuestionSent",
      data: this.currentquestion
    }
    this.sendToGroup(JSON.stringify(data));
  }

  nextQuestion() {
    this.curentQuestionIndex++
    this.sendQuestiontoPlayer()
    this.showingCorrectAnswer = false
    this.timeLeft = 100
    let ref = setInterval(() => {
      this.timeLeft -= 0.5
      this.x = Math.ceil(this.totalTimePerQuestion * this.timeLeft / 100000)
      if (this.timeLeft <= 0) {
        clearInterval(ref)
        this.showCorrectAnswer()
      }
    }, this.totalTimePerQuestion / (100 * 2));
    
  }

  checkAnswerAndAssignPoints(){
    let correctAnswer = this.questions[this.curentQuestionIndex].answers.find((correctAnswer)=>{
      return correctAnswer.isCorrect===true
    })
    this.players.forEach((player)=>{
      let x = player.submitedAnswers.find((submitedAsnwer)=>{
        return submitedAsnwer.questionId===this.currentquestion.id
      })

      if(x && x.answerId===correctAnswer?.id){
        player.score++
      }
      const data= {
        action:"CorrectAnswer",
        correctAnswerForPlayer: correctAnswer?.id
      }
      let correctAnswerForPlayer = JSON.stringify(data)
      this.sendToGroup(correctAnswerForPlayer)
    })
    this.players.sort(function(a,b){return b.score - a.score})
  }

  showCorrectAnswer() {
    this.showingCorrectAnswer = true
    this.checkAnswerAndAssignPoints()
    setTimeout(() => this.nextQuestion(), this.nextQuestionDelay)
  }

  public sendToGroup(data: string) {
    this.signalRService.sendToGroup(data)
  }

  public processMessage(data: any) {
    switch (data.action) {
      case 'QuestionSent':
        console.log('question sent to players', data.data) 
        break;
      case 'PlayerAnswered':
        console.log('player sent answer', data.data) 
        this.playerAnswer=data.data.answerId
        this.playerId=data.senderConnectionId
        this.recordAnswer(this.playerId, this.playerAnswer, this.currentquestion.id)
        break;
      case 'GroupCreated':
        console.log('assiging value to group name', data.data)
        this.groupName = data.data
        break;
      case 'PlayerJoined':
        data.data.submitedAnswers=[]
        data.data.score=0
        this.players.push(data.data)
        break;
      case 'PlayerDisconnected':
        this.players = this.players.filter((p) => p.connectionId != data.data)
        break;
      default:
        console.log(`Action not implemented: ${data.action}.`);
    }
  }

}
