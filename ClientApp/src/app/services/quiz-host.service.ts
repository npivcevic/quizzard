import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Subject } from 'rxjs';
import { Player } from '../model/player';

@Injectable({
  providedIn: 'root'
})
export class QuizHostService {

  public groupName: string = "";
  public players: Player[] = [];

  constructor(public signalRService: SignalrService) { }

  public async initialize() {
    await this.signalRService.startConnection();
    this.signalRService.hostQuiz();
    this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })
  }

  public sendToGroup(data: string) {
    this.signalRService.sendToGroup(data)
  }

  public processMessage(data: string) {
    let message = JSON.parse(data)

    switch (message.action) {
      case 'GroupCreated':
        console.log('assiging value to group name', message.data)
        this.groupName = message.data
        break;
      case 'PlayerJoined':
        this.players.push(message.data)
        break;
      case 'PlayerDisconnected':
        this.players = this.players.filter((p) => p.connectionId != message.data)
        break;
      default:
        console.log(`Action not implemented: ${message.action}.`);
    }
  }

}
