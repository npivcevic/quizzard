import { SubmitedAnswer } from './../model/submitedAnswer';
import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Player } from '../model/player';
import { QuestionService } from '../question.service';
import { Question } from '../model/question';
import { PlayerScore } from '../model/player-score';

@Injectable({
  providedIn: 'root'
})
export class QuizHostService {

  public groupName: string = "";
  public players: Player[] = [];
  public size:number=1;
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
  public timeLeft: number = 100;
  public totalTimePerQuestion: number = 7000; 
  public x: number = Math.ceil(this.totalTimePerQuestion / this.timeLeft);

  public showingCorrectAnswer: boolean = false
  public nextQuestionDelay: number = 2000
  //indicator for scoreboard
  public quizEnded: boolean = false
  public playerScoreboard: Player = {} as Player


  constructor(public signalRService: SignalrService, public questionservice: QuestionService) { }

  public async initialize() {
    await this.signalRService.startConnection();
    this.signalRService.hostQuiz();
    this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })

  }

  startQuiz() {
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
      data: this.currentquestion,
      timer: this.totalTimePerQuestion
    }
    this.sendToGroup(JSON.stringify(data));
  }

  nextQuestion() {
    if (this.curentQuestionIndex + 1 < this.questions.length) {
      this.evaluateanswers=false
      this.curentQuestionIndex++
      console.log(this.curentQuestionIndex, this.questions.length)
      this.sendQuestiontoPlayer()
      this.showingCorrectAnswer = false
      this.timeLeft = 100
      let ref = setInterval(() => {
        this.timeLeft -= 0.5
        this.x = Math.ceil(this.totalTimePerQuestion * this.timeLeft / 100000)
        if (this.timeLeft <= 0) {
          clearInterval(ref)
          this.showCorrectAnswer()
          this.evaluateanswers=true
        }
      }, this.totalTimePerQuestion / (100 * 2));
    } else {
      const data = {
        action: 'QuizEnded',
        data: true
      }
      let quizEndMessage = JSON.stringify(data)
      this.sendToGroup(quizEndMessage)
      this.players.forEach((player) => {
        this.sendScoreToPlayer(player.connectionId)
        player.submitedAnswers=[]
        console.log(player.name, player.submitedAnswers)
      })
      
      console.log("quiz ended")
      this.quizStarted = !this.quizStarted
      this.quizEnded = !this.quizEnded

    }
  }
// ==========================================================0
  public checkIfSubmitedAnswerExists(playerId:string){
    let submitedAnswerExist:boolean = false
    const player = this.players.find((player)=>{
      return player.connectionId===playerId
    })
    if(player!.submitedAnswers.length===0){
      return submitedAnswerExist
    }else{
      submitedAnswerExist=true
    }
    return submitedAnswerExist
  }


  public checkLastSubmitedAnswerState(playerId:string){
    let x = this.checkIfSubmitedAnswerExists(playerId)
    let lastSubmitedAnswerState:boolean=false
    if(x=false){
      console.log("submited answer is fasle")

      return
    }else{
      let player = this.findPlayerByPlayerId(playerId)
      let lastSubmitedAnswer = player?.submitedAnswers[player.submitedAnswers.length-1]
      let z = this.checkIfAnswerIsCorrect(lastSubmitedAnswer?.questionId, lastSubmitedAnswer?.answerId)
      if(z===true){
        lastSubmitedAnswerState=true
      }else{
        lastSubmitedAnswerState=false
      }
    }
    return lastSubmitedAnswerState
  }

  public addStyleToActivePlayerCard(playerId:string){
    let style= {}
    if(this.checkIfSubmitedAnswerExists(playerId)===false || this.findPlayerByPlayerId(playerId)?.submitedAnswers.length===this.curentQuestionIndex){
      style = {'background': ''}
    }else{
      if(this.evaluateanswers===true && this.checkLastSubmitedAnswerState(playerId)===true){
        style = {'background': 'rgb(153, 211, 153)'}
      }else if (this.evaluateanswers===true && this.checkLastSubmitedAnswerState(playerId)===false){
        style = {'background': 'rgb(236, 157, 157)'}
      }else if(this.checkIfSubmitedAnswerExists(playerId)===true){
        style = {'background':'rgb(250, 224, 118)'}
      }
    }
    return style
  }
// =======================================================
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
// ================================================
  public findPlayerByPlayerId(playerId:string){
    const player = this.players.find((player)=>{
      return player.connectionId===playerId
    })
    return player
  }
// =======================================================
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

  public showCorrectAnswer() {
    this.showingCorrectAnswer = true
    this.checkAnswerAndAssignPoints()
    setTimeout(() => this.nextQuestion(), this.nextQuestionDelay)
  }

  public checkIfAnswerIsCorrect(questionId: any, answerId: any){
    let x:boolean=false
    this.questions.forEach(question =>{
      if(question.id===questionId){
        const A = question.answers.find(answer=>{
          return answer.id===answerId
        })
        if (A?.isCorrect === true) {
          return x = true
        } else {
          return x = false
        }
      }
      return
    })
    return x
    
  }

  public sendScoreToPlayer(playerId: string) {
    let answerScore:PlayerScore[] = []
    const player = this.players.find((player) => {
      return player.connectionId === playerId
    })
    console.log("player data found", player)
    this.playerScoreboard.name = player!.name
    this.playerScoreboard.submitedAnswers = []
    player?.submitedAnswers.forEach((submitedAnswer) => {
      let x = this.findQuestionTextById(submitedAnswer.questionId)
      let y = this.findAnswerTextById(submitedAnswer.questionId, submitedAnswer.answerId)
      let z = this.checkIfAnswerIsCorrect(submitedAnswer.questionId, submitedAnswer.answerId)
      answerScore.push({
        questionText:x,
        answerText:y,
        isCorrect:z
      })
    })
    const data = {
      action: 'PlayerScore',
      data: answerScore
    }
    this.sendToPlayer(JSON.stringify(data), playerId)
    console.log("player data sent", answerScore)
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
