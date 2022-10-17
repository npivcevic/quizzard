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
  public questions: Question[] = []
  public currentquestion: Question = {} as Question;
  //indicator for start button 
  public playersJoining: boolean = true
  //indicator for questions 
  public quizStarted: boolean = false

  public playerAnswer: string = "";
  public playerId: string = "";
  public curentQuestionIndex: number = -1
  //spinner variables
  public timeLeft: number = 100;
  public totalTimePerQuestion: number = 4000
  public x: number = Math.ceil(this.totalTimePerQuestion / this.timeLeft)

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

    this.questionservice.getQuestions()
      .subscribe(data => this.questions = data)

  }

  startQuiz() {
    this.quizStarted = true
    this.playersJoining = false
    this.nextQuestion();
  }

  recordAnswer(playerId: string, answerId: string, questionId: string) {
    this.players.forEach((player) => {
      if (player.connectionId === playerId) {
        player.submitedAnswers.push({
          questionId,
          answerId
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
    const data = {
      action: "QuestionSent",
      data: this.currentquestion
    }
    this.sendToGroup(JSON.stringify(data));
  }

  nextQuestion() {
    if (this.curentQuestionIndex + 1 < this.questions.length) {
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
      })
      console.log("quiz ended")
      this.quizStarted = !this.quizStarted
      this.quizEnded = !this.quizEnded

    }
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

  public checkIfAnswerIsCorrect(questionId: string, answerId: string){
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
