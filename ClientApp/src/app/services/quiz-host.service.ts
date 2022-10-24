import { SubmitedAnswer } from './../model/submitedAnswer';
import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Player } from '../model/player';
import { QuestionService } from '../question.service';
import { Question } from '../model/question';
import { PlayerScore } from '../model/player-score';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class QuizHostService {

  public groupName: string = "";
  public players: Player[] = [];
  public size!:number;
  public questions: Question[] = []
  public currentquestion: Question = {} as Question;
  //indicator for start button 
  public playersJoining: boolean = true
  //indicator for questions 
  public quizStarted: boolean = false

  public playerAnswer: string = "";
  public playerId: string = "";
  public curentQuestionIndex: number =0
  public evaluateanswers:boolean=false;
  //spinner variables
  public totalTimePerQuestion!: number;
  public nextQuestionDelay: number = 5000

  public showingCorrectAnswer: boolean = false
  //indicator for scoreboard
  public quizEnded: boolean = false
  public playerScoreboard: Player = {} as Player

  public currentSpinnerTimeout=0
  public currentSpinnerText = "";

  constructor(public signalRService: SignalrService, public questionservice: QuestionService, public fb:FormBuilder) { }

  public async initialize() {
    await this.signalRService.startConnection();
    this.signalRService.hostQuiz();
    this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })

  }

  onChange(x:any){
    console.log(x)
    if(x.key==="-" || x.key==="0" || x.key==="." || x.key==="e"){
      x.preventDefault();
    }
  }

  quizSetup=this.fb.group({
    questionsNo : this.fb.control("",[Validators.required,Validators.min(1)]),
    answerTime : this.fb.control("", [Validators.required, Validators.min(1)]),
    questionDelay : this.fb.control("",[Validators.required, Validators.min(1)])
  })

  public onlyPositiveInt(x:number){
    let int!:number
    if(x<=0){
      this.quizSetup.patchValue({
        questtionsNo:"0"
      })
      console.log(this.quizSetup.value.questionsNo)
      int = x
    }
    if(x>0){
      int = x
    }
    console.log("actived", int)
    return int
  }

  startQuiz() {
    if(this.quizSetup.valid===true){
      this.size=this.quizSetup.value.questionsNo
      this.totalTimePerQuestion=this.quizSetup.value.answerTime*1000
      this.nextQuestionDelay=this.quizSetup.value.questionDelay*1000
      console.log("time for question", this.totalTimePerQuestion)
      this.questionservice.getRandomQuestions(this.size)
        .subscribe(data => {
          this.questions = data
          this.players.forEach((player) => {
            player.score=0
          })
          this.quizStarted = true
          this.quizEnded= false
          this.curentQuestionIndex=-1
          this.playersJoining = false
          this.nextQuestion();
        })
    }
    if(this.quizSetup.valid===false){
      console.log("invalid form")
    }

  }

  recordAnswer(playerId: string, answerId: string, questionId: string) {
    this.players.forEach((player) => {
      if (player.connectionId === playerId) {
        player.submitedAnswers.push({
          questionId,
          answerId,
          recordStatus: "Answered"
        })
      }
    })

  }

  sendQuestiontoPlayer() {
    this.currentquestion = Object.assign({}, this.questions[this.curentQuestionIndex])
    this.currentquestion.answers = this.questions[this.curentQuestionIndex].answers.map((answer) => {
      return {
        id: answer.id,
        text: answer.text
      }
    })
    this.currentquestion.answers =  this.currentquestion.answers.sort((a,b)=>0.5 -Math.random())
    const data = {
      action: "QuestionSent",
      data: [
        this.currentquestion,
        this.currentSpinnerText,
        this.currentSpinnerTimeout
            ],
      timer: this.totalTimePerQuestion
    }
    console.log(data)
    this.sendToGroup(JSON.stringify(data));
  }

  nextQuestion() {
    if (this.curentQuestionIndex + 1 >= this.questions.length) {
      this.quizEnd();
      return
    }

    this.currentSpinnerTimeout = this.totalTimePerQuestion;
    this.currentSpinnerText = "Preostalo vrijeme";
    this.evaluateanswers=false
    this.curentQuestionIndex++
    this.sendQuestiontoPlayer()
    this.showingCorrectAnswer = false
  }

  public showCorrectAnswer() {
    this.currentSpinnerTimeout = this.nextQuestionDelay;
    if(this.curentQuestionIndex+1<this.questions.length){  
      this.currentSpinnerText = "Sljedece pitanje";
      const data = {
        action: "EvaluatingAnswers",
        text: this.currentSpinnerText,
        timer: this.currentSpinnerTimeout
      }
      console.log("next question pack", data)
      this.sendToGroup(JSON.stringify(data)) }

    if(this.curentQuestionIndex+1===this.questions.length){    
      this.currentSpinnerText = "Kviz gotov za";}
    this.showingCorrectAnswer = true
    this.evaluateanswers=true
    const data = {
      action: "EvaluatingAnswers",
      text: this.currentSpinnerText,
      timer: this.currentSpinnerTimeout
    }
    console.log("quiz end question pack", data)
    this.sendToGroup(JSON.stringify(data)) 
    this.checkAnswerAndAssignPoints()
  }

  private quizEnd() {
    const data = {
      action: 'QuizEnded',
      data: true
    }
    let quizEndMessage = JSON.stringify(data)
    this.sendToGroup(quizEndMessage)
    this.players.forEach((player) => {
      this.sendScoreToPlayer(player.connectionId)
      player.submitedAnswers=[]
    })
    this.quizStarted = !this.quizStarted
    this.quizEnded = !this.quizEnded
  }

  public spinnerTimeout() {
    if (this.showingCorrectAnswer === true) {
      this.nextQuestion();
      return;
    }
    this.showCorrectAnswer();
  }

  private playerAnsweredCurrentQuestion(playerId: string) {
    let player = this.findPlayerByPlayerId(playerId);
    let answerIndex = player?.submitedAnswers.findIndex(a => a.questionId === this.currentquestion.id)
    if (answerIndex === -1) {
      return false;
    }
    return true;
  }

  private playerAnsweredCurrentQuestionCorrectlly (playerId: string): Boolean
  {
    let player = this.findPlayerByPlayerId(playerId);
    let answer = player?.submitedAnswers.find(a => a.questionId === this.currentquestion.id)
    if (answer === undefined) {
      return false;
    }
    return this.checkIfAnswerIsCorrect(answer.questionId, answer.answerId)
  }

  public addStyleToActivePlayerCard(playerId:string){
    if (!this.evaluateanswers) {
      if (!this.playerAnsweredCurrentQuestion(playerId)) {
        return {'background': ''}
      }
      return {'background':'rgb(250, 224, 118)'} //zuta
    }

    if (!this.playerAnsweredCurrentQuestion(playerId)) {
      return {'background': ''}
    }

    if (this.playerAnsweredCurrentQuestionCorrectlly(playerId)) {
      return {'background': 'rgb(153, 211, 153)'} //zelena
    }

    return {'background': 'rgb(236, 157, 157)'} //crvena
  }

  public checkAnswerAndAssignPoints() {
    let correctAnswer = this.questions[this.curentQuestionIndex].answers.find((correctAnswer) => {
      return correctAnswer.isCorrect === true
    })
    this.players.forEach((player) => {
      let x = player.submitedAnswers.find((submitedAsnwer) => {
        return submitedAsnwer.questionId === this.currentquestion.id
      })

      if (x && x.answerId === correctAnswer?.id) {
        player.score++
      }
      const data = {
        action: "CorrectAnswer",
        correctAnswerForPlayer: correctAnswer?.id
      }
      let correctAnswerForPlayer = JSON.stringify(data)
      this.sendToGroup(correctAnswerForPlayer)
    })
    this.players.sort(function (a, b) { return b.score - a.score })
  }

  public findPlayerByPlayerId(playerId:string){
    const player = this.players.find((player)=>{
      return player.connectionId===playerId
    })
    return player
  }

  public findQuestionTextById(questionId: string) {
    const Q = this.questions.find((question) => {
      return question.id === questionId
    })
    return Q!.text
  }

  public findAnswerTextById(questionId: string, answerId: string) {
    let answerText = '';
    this.questions.forEach((question) => {
      if (question.id === questionId) {
        const A = question.answers.find((answer) => {
          return answer.id === answerId
        })
        return answerText = A!.text
      }
      return
    })
    return answerText
  }

  public addStyleToPlayerAnswerOnScoreboard(questionId: string, answerId: string) {
    let style = {}

    this.questions.forEach((question) => {
      if (question.id === questionId) {
        const A = question.answers.find((answer) => {
          return answer.id === answerId
        })
        if (A?.isCorrect === true) {
          return style = { 'background': 'rgb(153, 211, 153)' }
        } else {
          return style = { 'background': 'rgb(236, 157, 157)' }
        }
      }
      return
    })
    return style
  }

  public checkIfAnswerIsCorrect(questionId: any, answerId: any){
    let x:boolean=false
    this.questions.forEach(question =>{
      if(question.id===questionId){
        const A = question.answers.find(answer=>{
          return answer.id===answerId
        })
        if (A?.isCorrect) {
          return x = true
        } 
        if(!A?.isCorrect) {
          return x = false
        }
      }
      return
    })
    return x
    
  }

  public sendScoreToPlayer(playerId: string) {
    let answerScore:PlayerScore[] = []
    const player = this.findPlayerByPlayerId(playerId)
    player?.submitedAnswers.forEach((submitedAnswer) => {
      let x = this.findQuestionTextById(submitedAnswer.questionId)
      let y = this.findAnswerTextById(submitedAnswer.questionId, submitedAnswer.answerId)
      let z = this.checkIfAnswerIsCorrect(submitedAnswer.questionId, submitedAnswer.answerId)
      answerScore.push({
        questionText:x,answerText:y,isCorrect:z
      })
    })
    const data = {
      action: 'PlayerScore',
      data: answerScore
    }
    this.sendToPlayer(JSON.stringify(data), playerId)
  }

  public sendToPlayer(data: string, playerConnectionId: string) {
    this.signalRService.sendToPlayer(data, playerConnectionId)
  }

  public sendToGroup(data: string) {
    this.signalRService.sendToGroup(data)
  }

  public processMessage(data: any) {
    switch (data.action) {
      case 'QuestionSent':
        break;
      case 'PlayerAnswered':
        this.playerAnswer = data.data.answerId
        this.playerId = data.senderConnectionId
        this.recordAnswer(this.playerId, this.playerAnswer, this.currentquestion.id)
        break;
      case 'GroupCreated':
        this.groupName = data.data
        break;
      case 'PlayerJoined':
        data.data.submitedAnswers = []
        data.data.score = 0
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
