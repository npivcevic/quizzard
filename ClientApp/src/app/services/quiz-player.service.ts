import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { QuizPlayerData, QuizPlayerState } from '../classes/QuizPlayerData';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { HostDisconnectedComponent } from '../host-disconnected/host-disconnected.component';
import {  MatDialog } from '@angular/material/dialog';
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
  
  constructor(public signalRService: SignalrService, public fb : UntypedFormBuilder, private dialog: MatDialog ) { }

  public async initialize() {
    await this.signalRService.startConnection();
    this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })
    await this.checkIfReconnectIsPossible()
    this.quizData.quizState = QuizPlayerState.Disconnected
  }

  openHostDisconnectedDialog():void{
    const dialog = this.dialog.open(HostDisconnectedComponent, {
      width: '50%',
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

  public questionAnswered(answerId: string) {
    this.quizData.currentAnswerId = answerId
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
        break
      case 'CorrectAnswer':
        if (this.quizData.quizState !== QuizPlayerState.QuestionShowing) {
          return
        }
        this.quizData.quizState = QuizPlayerState.AnswersShowing
        this.quizData.currentCorrectAnswerId = data.data.correctAnswerId
        this.currentSpinnerText = data.data.spinnerText
        this.currentSpinnerTimeout = data.data.spinnerTimer
        break
      case 'HostDisconnected':
        this.quizData.quizState = QuizPlayerState.Disconnected
        this.openHostDisconnectedDialog()
        break
      case 'QuizEnded':
        this.quizData.quizState = QuizPlayerState.End
        break
      case 'PlayerScore':
        console.log(data.data)
        this.quizData.playerScore = data.data
        break
      case 'PlayersScoreboard':
        this.quizData.dataSource = data.data
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
      default:
        console.log(`Action not implemented: ${data.action}.`)
    }
  }
}
