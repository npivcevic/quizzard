import { Question } from './../model/question';
import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizPlayerService {

  public groupName: Subject<string> = new Subject<string>();
  public currentquestion:Question={} as Question;
  public playerJoined:boolean=false;
  public startQuiz:boolean=false;
  public selectedAnswerId:string='';
  public answerIsSelected:boolean=false;
  public playerId:string='';


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

  public sendAnswerToHost(id?:string) {
    this.selectedAnswerId!=id
    this.answerIsSelected=true
    console.log(this.selectedAnswerId)
    const data = {
      action: "PlayerAnswered",
      data: {
        name: this.playerId,
        answerId: id 
      }
    }
    this.sendToHost(JSON.stringify(data));
  }

  public processMessage(data: any) {
    switch(data.action){
      case 'SuccesfullyJoinedGroup':
        this.playerJoined=true
        break
      case 'QuestionSent':
        this.startQuiz=true
        this.selectedAnswerId="";
        this.answerIsSelected=false
        this.currentquestion=data.data
        break
      default:
        console.log(`Action not implemented: ${data.action}.`);
    }
  }
}
