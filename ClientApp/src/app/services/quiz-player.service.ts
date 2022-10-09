import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizPlayerService {

  public groupName: Subject<string> = new Subject<string>();
  public players: string[] = [];

  constructor(public signalRService: SignalrService) { }

  public async initialize() {
    await this.signalRService.startConnection();
  }

  public joinQuiz(groupName: string, playerName: string) {
    this.signalRService.joinQuiz(groupName, playerName);
  }

  public sendToHost(data: string) {
    this.signalRService.sendToHost(data)
  }

  public processMessage(data: string) {
    console.log("processing message", data)
    let message = JSON.parse(data)
    console.log("message", message)

    if (message.action === "SuccesfullyJoinedGroup") {
      console.log("Successfuly joined group: ", message.data)
    }

    if (message.action === "SuccesfullyJoinedGroup") {
      console.log("Successfuly joined group: ", message.data)
    }

  }
}
