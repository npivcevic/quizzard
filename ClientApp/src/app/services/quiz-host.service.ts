import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Player } from '../classes/Player';
import { QuestionService } from '../question.service';
import { QuizHostData, QuizState } from '../classes/QuizHostData';
import { QuizSettings } from '../model/QuizSettings';

@Injectable({
  providedIn: 'root'
})
export class QuizHostService {
  public quizData!: QuizHostData
  public quizSettings!: QuizSettings
  

  constructor(public signalRService: SignalrService, public questionservice: QuestionService) { }

  public async initialize() {
    this.quizData = new QuizHostData()
    await this.signalRService.startConnection();
    this.signalRService.hostQuiz();
    this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })
  }

  startQuiz(quizSettings: QuizSettings) {
    this.quizSettings = quizSettings
    this.questionservice.getRandomQuestions(this.quizSettings.numberOfQuestions)
      .subscribe(data => {
        this.quizData.reset();
        this.quizData.questions = data
        this.nextQuestion();
      })
  }

  nextQuestion() {
    if (this.quizData.isLastQuestion()) {
      this.quizEnd()
      return
    }

    this.quizData.nextQuestion()
    this.sendQuestiontoGroup()
  }

  public showCorrectAnswer() {
    this.quizData.quizState = QuizState.AnswersShowing
    this.quizData.checkAnswersAndAssignPoints()
    this.sendCorrectAnswerToGroup()
  }

  private quizEnd() {
    this.quizData.quizState = QuizState.Idle
    this.sendQuizEndedToGroup()
    this.quizData.players.forEach((player) => {
      this.sendScoreToPlayer(player)
    })
  }

  public sendQuestiontoGroup() {
    const data = {
      action: "QuestionSent",
      data: {
        question : this.quizData.currentQuestionWithoutIsCorrect(),
        text : "Preostalo vrijeme",
        timer : this.quizSettings.totalTimePerQuestion
      }
    }
    this.sendToGroup(JSON.stringify(data));
  }

  public sendEvaluatingAnswersToGroup() {
    const data = {
      action: "EvaluatingAnswers",
      data : {
        text: this.quizData.isLastQuestion() ? "Kviz gotov za" : "Sljedece pitanje",
        timer: this.quizSettings.nextQuestionDelay
      }
    }
    this.sendToGroup(JSON.stringify(data))
  }

  public sendQuizEndedToGroup() {
    const data = {
      action: 'QuizEnded',
      data: true
    }
    this.sendToGroup(JSON.stringify(data))
  }

  public sendCorrectAnswerToGroup() {
    const data = {
      action: "CorrectAnswer",
      data: {
        correctAnswerId: this.quizData.getCorrectAnswerToCurrentQuestion()?.id,
        spinnerText: this.quizData.isLastQuestion() ? "Kviz gotov za" : "Sljedece pitanje",
        spinnerTimer: this.quizSettings.nextQuestionDelay
      }
    }
    this.sendToGroup(JSON.stringify(data))
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
        this.quizData.recordAnswer(data.senderConnectionId, data.data.answerId)
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
