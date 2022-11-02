import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { QuizPlayerData, QuizPlayerState } from '../classes/QuizPlayerData';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class QuizPlayerService {

  public quizData: QuizPlayerData = new QuizPlayerData()

  public currentSpinnerTimeout = 0
  public currentSpinnerText = ""
  
  constructor(public signalRService: SignalrService, public fb : FormBuilder) { }

  public async initialize() {
    await this.signalRService.startConnection();
    this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })
  }

  public joinQuiz(groupName: string, playerName: string) {
    this.quizData.groupName = groupName
    this.quizData.playerName = playerName
    this.signalRService.joinQuiz(groupName, playerName)
  }

  public questionAnswered(answerId: string) {
    this.quizData.currentAnswerId = answerId
    this.sendAnswerToHost()
  }

  public sendAnswerToHost() {
    const data = {
      action: "PlayerAnswered",
      data: {
        answerId: this.quizData.currentAnswerId
      }
    }
    this.sendToHost(JSON.stringify(data))
  }

  public sendToHost(data: string) {
    this.signalRService.sendToHost(data)
  }

  public processMessage(data: any) {
    switch (data.action) {
      case 'SuccesfullyJoinedGroup':
        this.quizData.quizState = QuizPlayerState.WaitingForStart
        break
      case 'QuestionSent':
        this.quizData.questionReceived(data.data.question)
        this.quizData.quizState = QuizPlayerState.QuestionShowing

        this.currentSpinnerText = data.data.text
        this.currentSpinnerTimeout = data.data.timer
        break
      case 'CorrectAnswer':
        this.quizData.quizState = QuizPlayerState.AnswersShowing
        this.quizData.currentCorrectAnswerId = data.data.correctAnswerId
        this.currentSpinnerText = data.data.spinnerText
        this.currentSpinnerTimeout = data.data.spinnerTimer
        break
      case 'QuizEnded':
        this.quizData.quizState = QuizPlayerState.End
        break
      case 'PlayerScore':
        this.quizData.playerScore = data.data
        break
      default:
        console.log(`Action not implemented: ${data.action}.`)
    }
  }
}
