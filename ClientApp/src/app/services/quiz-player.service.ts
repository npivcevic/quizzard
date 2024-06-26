import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { QuizPlayerData, QuizPlayerState } from '../classes/QuizPlayerData';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { SimpleDialogComponent } from '../simple-dialog/simple-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class QuizPlayerService {

  readonly CONNECTION_STORAGE_KEY = 'lastConnection'

  public quizData: QuizPlayerData = new QuizPlayerData()

  public currentSpinnerTimeout = 0
  public currentSpinnerText = ""
  public joinErrorMessage = "";

  private retryConnectionIntervalID : number | undefined;
  private currentDialog: MatDialogRef<SimpleDialogComponent> | undefined;
  
  constructor(public signalRService: SignalrService, public fb : UntypedFormBuilder, private dialog: MatDialog ) { }

  public async initialize() {
    if (this.signalRService.isConnected()) {
      return
    }

    await this.signalRService.startConnection();
    this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })
    await this.checkIfReconnectIsPossible()
    this.quizData.quizState = QuizPlayerState.Disconnected
  }

  openSimpleDialog(text: string):void{
    this.currentDialog?.close()
    this.currentDialog = this.dialog.open(SimpleDialogComponent, {
      width: '80%',
      data: { text: text },
    })
  }

  public joinQuiz(groupName: string, playerName: string) {
    this.quizData.groupName = groupName
    this.quizData.playerName = playerName
    this.removeErrorMessages();
    this.signalRService.joinQuiz(groupName, playerName)
  }

  public async checkIfReconnectIsPossible() {
    let lastConnection = this.loadLastConnection()
    if (!lastConnection) {
      return
    }

    const FOUR_HOURS = 4 * 60 * 60 * 1000;
    if (Date.now() - lastConnection.connectedAt > FOUR_HOURS) {
      this.clearLastConnectionFromLocalStorage();
      return
    }

    await this.signalRService.reconnectCheck(lastConnection.groupName, lastConnection.playerName, lastConnection.connectionId);
  }

  public loadLastConnection() {
    let lastConnection = localStorage.getItem(this.CONNECTION_STORAGE_KEY)
    if (!lastConnection) {
      return null
    }

    return JSON.parse(lastConnection)
  }

  public reconnectToQuiz() {
    let lastConnection = localStorage.getItem(this.CONNECTION_STORAGE_KEY)
    if (lastConnection) {
      let connection = JSON.parse(lastConnection)
      this.quizData.groupName = connection.groupName
      this.quizData.playerName = connection.playerName
      this.signalRService.reconnect(connection.groupName, connection.playerName, connection.connectionId);
    }
  }

  public questionAnswered(answerText:string ,answerId: string) {
    this.quizData.currentAnswerId = answerId
    this.quizData.currentAnswerText = answerText

    this.sendAnswerToHost()
  }

  public saveCurrentConnectionToLocalStorage() {
    localStorage.setItem(this.CONNECTION_STORAGE_KEY, JSON.stringify({
      connectedAt: Date.now(),
      groupName: this.quizData.groupName,
      playerName: this.quizData.playerName,
      connectionId: this.signalRService.connectionId
    }))
  }

  public clearLastConnectionFromLocalStorage() {
    localStorage.removeItem(this.CONNECTION_STORAGE_KEY)
  }

  public sendAnswerToHost() {
    const data = {
      action: "PlayerAnswered",
      data: {
        answerText: this.quizData.currentAnswerText,
        answerId: this.quizData.currentAnswerId
      }
    }
    this.sendToHost(JSON.stringify(data))
  }

  public sendToHost(data: string) {
    this.signalRService.sendToHost(data)
  }

  public removeErrorMessages() {
    this.joinErrorMessage = ""
  }

  private handleNumberOfPlayersWhoAnswered(numberOfPlayers: number, numberOfPlayersWhoAnswered: number) {
    if (this.quizData.numberOfPlayersWhoAnswered < numberOfPlayersWhoAnswered) {
      this.quizData.numberOfPlayers = numberOfPlayers
      this.quizData.numberOfPlayersWhoAnswered = numberOfPlayersWhoAnswered
    }
  }

  public handleConnectionLost() {
    this.openSimpleDialog("Izubljena veza sa serverom, pokušavamo te vratiti u igru...")
    this.retryConnectionIntervalID = window.setInterval(async () => {
      if (this.signalRService.isConnected()) {
        this.quizData.quizState = QuizPlayerState.Disconnected
        clearInterval(this.retryConnectionIntervalID)
        await this.checkIfReconnectIsPossible()
        this.currentDialog?.close();
        if (this.quizData.reconnectPossible) {
          this.reconnectToQuiz();
        }
        return;
      }

      try {
        await this.signalRService.startConnection()
      } catch (e) {
        console.error('Unable to start ws connection, error: ', e)
      }
    }, 1000)
  }

  public processMessage(data: any) {
    switch (data.action) {
      case 'SuccesfullyJoinedGroup':
        this.quizData.quizState = QuizPlayerState.WaitingForStart
        this.saveCurrentConnectionToLocalStorage()
        break
      case 'QuestionSent':
        this.quizData.questionReceived(data.data.question)
        this.quizData.quizState = QuizPlayerState.QuestionShowing

        this.currentSpinnerText = data.data.text
        this.currentSpinnerTimeout = data.data.timer
        this.quizData.currentQuestionNumber = data.data.questionNumber
        this.quizData.totalNumberOfQuestionsInSet = data.data.totalQuestions
        this.quizData.currentSetNumber = data.data.setNumber
        this.quizData.totalNumberOfSets = data.data.totalSets
        this.quizData.numberOfPlayers = data.data.numberOfPlayers
        this.quizData.numberOfPlayersWhoAnswered = 0
        break
      case 'CorrectAnswer':
        if (this.quizData.quizState !== QuizPlayerState.QuestionShowing) {
          return
        }
        this.quizData.quizState = QuizPlayerState.AnswersShowing
        this.quizData.currentCorrectAnswerId = data.data.correctAnswerId
        this.currentSpinnerText = data.data.spinnerText
        this.currentSpinnerTimeout = data.data.spinnerTimer
        this.quizData.setScoreBoard(data.data.scoreBoard, this.signalRService.connectionId)
        break
      case 'HostDisconnected':
        this.quizData.quizState = QuizPlayerState.Disconnected
        this.openSimpleDialog("Voditelj kviza je napustio igru.")
        break
      case 'QuizEnded':
        this.quizData.quizState = QuizPlayerState.End
        break
      case 'PlayerScore':
        this.quizData.playerScore = data.data
        break
      case 'PlayersScoreboard':
        this.quizData.setScoreBoard(data.data, this.signalRService.connectionId)
        break
      case 'ReconnectNotPossible':
        this.quizData.reconnectPossible = false;
        this.clearLastConnectionFromLocalStorage()
        break
      case 'ReconnectPossibleOldClientDisconnected':
        this.quizData.reconnectPossible = true;
        break
      case 'ReconnectPossibleOldClientConnected':
        this.quizData.reconnectPossible = true;
        this.quizData.oldClientConnected = true;
        break
      case 'SuccesfullyReconnected':
        this.quizData.quizState = QuizPlayerState.WaitingForStart
        this.quizData.reconnected = true
        this.saveCurrentConnectionToLocalStorage()
        break
      case 'RejoinedInADifferentTab':
        this.initialize()
        break
      case "NextSetDelay":
        this.quizData.quizState = QuizPlayerState.SetDelayShowing
        this.currentSpinnerText = data.data.text
        this.currentSpinnerTimeout = data.data.timer
        break;
      case "ErrorTryingToJoinNonExistingGroup":
        this.quizData.quizState = QuizPlayerState.Disconnected
        this.joinErrorMessage = "Neuspješno spajanje. Kviz '" + this.quizData.groupName + "' ne postoji."
        break;
      case "ErrorGroupHasPlayerWithSameName":
        this.quizData.quizState = QuizPlayerState.Disconnected
        this.joinErrorMessage = "Neuspješno spajanje. Igrač s imenom " + this.quizData.playerName + " na kvizu '" + this.quizData.groupName + "' već postoji. Molimo odaberite neko drugo ime i pokušajte ponovno."
        break;
      case "DisconnectedByHost":
        this.quizData.quizState = QuizPlayerState.Disconnected
        this.openSimpleDialog("Izbačen si od strane voditelja kviza.")
        this.clearLastConnectionFromLocalStorage()
        break;
      case "ConnectionLost":
        this.handleConnectionLost();
        break;
      case "NumberOfPlayersWhoAnswered":
        this.handleNumberOfPlayersWhoAnswered(data.data.numberOfPlayers, data.data.numberOfPlayersWhoAnsweredCurrentQuestion);
        break;
      default:
        console.log(`Action not implemented: ${data.action}.`)
    }
  }
}
