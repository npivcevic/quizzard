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
  public correctAnswerId:string='';


  constructor(public signalRService: SignalrService) { }

  public async initialize() {
    await this.signalRService.startConnection();
    this.signalRService.dataReceived.subscribe({
      next: (data) => this.processMessage(data)
    })
  }

  public answerStyle(answer:any){
    let style={}
    if(this.correctAnswerId===answer){
      return style = {
        'background':'rgb(153, 211, 153)'
      }
    }else if(this.selectedAnswerId===answer){
      return style = {
        'background':'rgb(250, 224, 118)'
      }
    }
    return style
  }

  public joinQuiz(groupName: string, playerName: string) {
    this.signalRService.joinQuiz(groupName, playerName);
  }

  public sendToHost(data: string) {
    this.signalRService.sendToHost(data)
  }

  public sendAnswerToHost(id:any) {
    this.selectedAnswerId=id
    console.log("this is selectd ansswer id", this.selectedAnswerId)
    this.answerIsSelected=true
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
        case 'CorrectAnswer':
          this.correctAnswerId=data.correctAnswerForPlayer
          break
      default:
        console.log(`Action not implemented: ${data.action}.`);
    }
  }
}
