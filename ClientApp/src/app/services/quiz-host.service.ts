import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Player } from '../classes/Player';
import { QuestionService } from '../question.service';
import { FormBuilder, Validators } from '@angular/forms';
import { QuizHostData, QuizState } from '../classes/QuizHostData';

@Injectable({
  providedIn: 'root'
})
export class QuizHostService {

  public quizData!: QuizHostData

  public size!: number;

  //spinner variables
  public totalTimePerQuestion!: number;
  public nextQuestionDelay: number = 5000
  public currentSpinnerTimeout = 0
  public currentSpinnerText = "";

  constructor(public signalRService: SignalrService, public questionservice: QuestionService, public fb: FormBuilder) { }

  public async initialize() {
    this.quizData = new QuizHostData()
    await this.signalRService.startConnection();
    this.signalRService.hostQuiz();
    this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })

  }

  quizSetup = this.fb.group({
    questionsNo: this.fb.control(1, [Validators.required, Validators.min(1)]),
    answerTime: this.fb.control(1, [Validators.required, Validators.min(1)]),
    questionDelay: this.fb.control(1, [Validators.required, Validators.min(1)])
  })

  startQuiz() {
    if (this.quizSetup.valid === true) {
      this.size = this.quizSetup.value.questionsNo!
      this.totalTimePerQuestion = this.quizSetup.value.answerTime! * 1000
      this.nextQuestionDelay = this.quizSetup.value.questionDelay! * 1000
      this.questionservice.getRandomQuestions(this.size)
        .subscribe(data => {
          this.quizData.reset();
          this.quizData.questions = data
          this.nextQuestion();
        })
    }
    if (this.quizSetup.valid === false) {
      console.log("invalid form")
    }

  }

  sendQuestiontoPlayer() {
    const data = {
      action: "QuestionSent",
      data: [
        this.quizData.currentQuestionWithoutIsCorrect(),
        this.currentSpinnerText,
        this.currentSpinnerTimeout
      ],
      timer: this.totalTimePerQuestion
    }
    this.sendToGroup(JSON.stringify(data));
  }

  nextQuestion() {
    if (this.quizData.isLastQuestion()) {
      this.quizEnd()
      return
    }

    this.quizData.nextQuestion()

    this.currentSpinnerTimeout = this.totalTimePerQuestion;
    this.currentSpinnerText = "Preostalo vrijeme";

    this.sendQuestiontoPlayer()
  }

  public showCorrectAnswer() {
    this.quizData.quizState = QuizState.AnswersShowing
    this.checkAnswerAndAssignPoints()

    this.currentSpinnerTimeout = this.nextQuestionDelay;
    this.currentSpinnerText = this.quizData.isLastQuestion() ? "Kviz gotov za" : "Sljedece pitanje"

    const data = {
      action: "EvaluatingAnswers",
      text: this.currentSpinnerText,
      timer: this.currentSpinnerTimeout
    }
    this.sendToGroup(JSON.stringify(data))
  }

  private quizEnd() {
    this.quizData.quizState = QuizState.Idle
    const data = {
      action: 'QuizEnded',
      data: true
    }
    let quizEndMessage = JSON.stringify(data)
    this.sendToGroup(quizEndMessage)

    this.quizData.players.forEach((player) => {
      this.sendScoreToPlayer(player)
    })
  }

  public spinnerTimeout() {
    if (this.quizData.quizState === QuizState.AnswersShowing) {
      this.nextQuestion();
      return;
    }
    this.showCorrectAnswer();
  }

  public addStyleToActivePlayerCard(player: Player) {
    if (this.quizData.quizState !== QuizState.AnswersShowing) {
      if (!player.hasAnswered(this.quizData.currentQuestion?.id)) {
        return { 'background': '' }
      }
      return { 'background': 'rgb(250, 224, 118)' } //zuta
    }

    if (!player.hasAnswered(this.quizData.currentQuestion.id)) {
      return { 'background': '' }
    }

    if (player.hasAnsweredCorrectly(this.quizData.currentQuestion.id)) {
      return { 'background': 'rgb(153, 211, 153)' } //zelena
    }

    return { 'background': 'rgb(236, 157, 157)' } //crvena
  }

  public checkAnswerAndAssignPoints() {
    this.quizData.checkAnswersAndAssignPoints()
    const data = {
      action: "CorrectAnswer",
      correctAnswerForPlayer: this.quizData.getCorrectAnswerToCurrentQuestion()?.id
    }
    let correctAnswerForPlayer = JSON.stringify(data)
    this.sendToGroup(correctAnswerForPlayer)
  }

  public sendScoreToPlayer(player: Player) {
    const data = {
      action: 'PlayerScore',
      data: player.getQuizReviewBoard(this.quizData.questions)
    }
    this.sendToPlayer(JSON.stringify(data), player.connectionId)
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
        const playerConnectionId = data.senderConnectionId
        const answerId = data.data.answerId
        this.quizData.recordAnswer(playerConnectionId, answerId)
        break;
      case 'GroupCreated':
        this.quizData.groupName = data.data
        break;
      case 'PlayerJoined':
        this.quizData.playerConnected(data.data.connectionId, data.data.name)
        break;
      case 'PlayerDisconnected':
        this.quizData.playerDisconnected(data.data)
        break;
      default:
        console.log(`Action not implemented: ${data.action}.`);
    }
  }

}
