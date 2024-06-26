import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Player } from '../classes/Player';
import { QuestionService } from '../question.service';
import { QuizHostData, QuizState } from '../classes/QuizHostData';
import { QuizSettings } from '../model/QuizSettings';
import { QuizzesService } from './quizzes.service';
import { SoundService, Sound } from './sound.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizHostService {
  public quizData: QuizHostData = new QuizHostData()
  public quizSettings:QuizSettings = new QuizSettings()
  
  private dataReceivedObserver!: Subscription;

  constructor(public signalRService: SignalrService,
    public questionservice: QuestionService,
    public quizservice: QuizzesService,
    private soundService: SoundService) { }

  public async initialize() {
    await this.signalRService.startConnection();
    this.dataReceivedObserver = this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })
    
    if (!this.quizData.groupName) {
      this.signalRService.hostQuiz();
    }
    
    this.quizSettings.loadFromLocalStorage();
  }

  public async stopProcessingMessages() {
    this.dataReceivedObserver.unsubscribe()
  }

  backFromPreview(){
    this.quizData.quizState.next(QuizState.Idle)
  }

  previewQuiz(quizId: string){
    this.soundService.playBackgroundMusic()
    this.quizservice.getQuiz(quizId)
      .subscribe(data => {
        this.quizData.reset();
        this.quizData.quiz = data
        this.quizData.quiz.questionSets = data.questionSets
        this.quizData.currentQuestionSet = data.questionSets[this.quizData.currentQuestionSetIndex]
        this.quizData.questions = data.questionSets[this.quizData.currentQuestionSetIndex].questions
        this.quizData.quizState.next(QuizState.QuizPreview)
      })
  }

  startQuiz_(quizSettings: QuizSettings, quizId: string) {
    this.quizSettings = quizSettings
    this.quizData.quizState.next(QuizState.QuizStartDelayShowing)
  }

  nextQuestion() {
    if (this.quizData.isLastQuestion() && !this.quizData.isLastQuestionSet()) {
      this.nextQuestionSet()
      return
    }

    if (this.quizData.isLastQuestion() && this.quizData.isLastQuestionSet()) {
      this.quizEnd()
      return
    }

    this.quizData.nextQuestion()
    this.sendQuestiontoGroup()
  }

  public updateQuizSettings(quizSettings: QuizSettings) {
    this.quizSettings = quizSettings;
    this.quizSettings.saveToLocalStorage()
  }

  public nextQuestionSet() {
    this.quizData.nextQuestionSet()
    this.sendNextSetDelay()
  }

  public showCorrectAnswer() {
    this.soundService.playSound(Sound.AnswerReveal01);
    this.quizData.quizState.next(QuizState.AnswersShowing)
    this.quizData.checkAnswersAndAssignPoints()
    this.sendCorrectAnswerToGroup()
  }

  private quizEnd() {
    this.quizData.quizState.next(QuizState.AfterQuiz)
    this.sendQuizEndedToGroup()
    this.quizData.players.forEach((player) => {
      this.sendScoreToPlayer(player)
    })
    this.sendScoreBoardToPlayers()
  }

  public sendQuestiontoGroup() {
    const data = {
      action: "QuestionSent",
      data: {
        question: this.quizData.currentQuestionWithoutIsCorrect(),
        questionNumber: this.quizData.currentQuestionIndex+1,
        totalQuestions: this.quizData.currentQuestionSet.questions.length,
        setNumber: this.quizData.currentQuestionSetIndex+1,
        totalSets: this.quizData.quiz.questionSets.length,
        text: "Preostalo vrijeme",
        timer: this.quizSettings.totalTimePerQuestion,
        numberOfPlayers: this.quizData.players.length
      }
    }
    this.sendToGroup(JSON.stringify(data));
  }

  public sendNextSetDelay() {
    const data = {
      action: "NextSetDelay",
      data: {
        text: "Sljedeći set za",
        timer: this.quizSettings.nextSetDelay
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
        correctAnswerId: this.quizData.getCorrectAnswerToCurrentQuestion()?.answerId,
        spinnerText: this.quizData.isLastQuestion()
          ? this.quizData.isLastQuestionSet() ? "Kviz gotov za" : "Set gotov za"
          : "Sljedeće pitanje",
        spinnerTimer: this.quizSettings.nextQuestionDelay,
        scoreBoard: this.quizData.playersScoreboard(),
      }
    }
    this.sendToGroup(JSON.stringify(data))
  }

  public sendScoreToPlayer(player: Player) {
    const data = {
      action: 'PlayerScore',
      data: player.getQuizReviewBoard(this.quizData.quiz.questionSets)
    }
    this.sendToPlayer(JSON.stringify(data), player.connectionId)
  }

  public sendScoreBoardToPlayers() {
    const data = {
      action: "PlayersScoreboard",
      data: this.quizData.playersScoreboard()
    }
    
    this.sendToGroup(JSON.stringify(data))
  }

  public sendNumberOfPlayersWhoAnsweredToGroup() {
    const data = {
      action: "NumberOfPlayersWhoAnswered",
      data: {
        numberOfPlayers: this.quizData.players.length,
        numberOfPlayersWhoAnsweredCurrentQuestion: this.quizData.numberOfPlayersWhoAnsweredCurrentQuestion()
      }
    }

    this.sendToGroup(JSON.stringify(data))
  }

  removePlayerFromQuiz(player: Player ){
    this.quizData.removePlayer(player.connectionId)
    this.signalRService.removePlayerGromGroup(player.connectionId, this.quizData.groupName)
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
        this.quizData.recordAnswer(data.senderConnectionId, data.data.answerId,data.data.answerText)
        this.sendNumberOfPlayersWhoAnsweredToGroup()
        if (this.quizData.checkIfAllPlayerAnsweredCurrentQuestion() &&
            this.quizSettings.MoveToNextQuestionWhenAllPlayersAnswered) {
              this.showCorrectAnswer()
              return;
        }
        this.soundService.playSound(Sound.PlayerAnswered01)
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
      case 'PlayerReconnected':
        this.quizData.playerReconnected(data.data.connectionId, data.data.oldConnectionId)
        break;
      default:
        console.log(`Action not implemented: ${data.action}.`);
    }
  }
}
