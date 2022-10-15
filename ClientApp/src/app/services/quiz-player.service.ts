import { Question } from './../model/question';
import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizPlayerService {

  public groupName: Subject<string> = new Subject<string>();
  public players: string[] = [];
  public currentquestion:Question={} as Question;
  public playerJoined:boolean=false;
  public startQuiz:boolean=false;
  public answerIsCorrect:boolean=false;


  constructor(public signalRService: SignalrService) { }

  public async initialize() {
    await this.signalRService.startConnection();
    this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })
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
      this.playerJoined=true
      console.log(this.playerJoined)
    }

    if (message.action === "QuestionSent") {
      console.log("QuestionRecieved: ", message.data)
      this.answerIsCorrect=false
      this.startQuiz=true
      this.currentquestion=message.data
    }

  }
}
