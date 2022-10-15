import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Subject } from 'rxjs';
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
  public curentQuestionIndex: number = -1
  public timeLeft: number = 100;
  public totalTimePerQuestion: number = 12000
  public x: number = Math.ceil(this.totalTimePerQuestion / this.timeLeft)
  public showingCorrectAnswer: boolean = false
  public nextQuestionDelay: number = 2000


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
  
  sendQuestiontoPlayer(){
    this.currentquestion=Object.assign({},this.questions[this.curentQuestionIndex])
    console.log(this.currentquestion,this.questions[this.curentQuestionIndex] )
    this.currentquestion.answers=this.questions[this.curentQuestionIndex].answers.map((answer)=>{
      delete answer.isCorrect
      return answer
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
    if(this.timeLeft===0){
      this.nextQuestion()
    }

  }

  showCorrectAnswer() {
    this.showingCorrectAnswer = true
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
        console.log(this.playerAnswer)
        break;
      case 'GroupCreated':
        console.log('assiging value to group name', data.data)
        this.groupName = data.data
        break;
      case 'PlayerJoined':
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
