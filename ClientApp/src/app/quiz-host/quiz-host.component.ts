import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { Player } from '../model/player';

@Component({
  selector: 'app-quiz-host',
  templateUrl: './quiz-host.component.html',
  styleUrls: ['./quiz-host.component.css']
})
export class QuizHostComponent implements OnInit {

  quizGroupName: string;
  inputData: string = "";

  constructor(public signalRService: SignalrService) {
    this.quizGroupName = ""
  }

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.addTransferDataListener();
  }

  public hostQuiz() {
    this.quizGroupName = this.makeid(5);
    this.signalRService.hostQuiz(this.quizGroupName)
  }

  public sendDataToGroup() {
    console.log('input', this.inputData)
    this.signalRService.sendToGroup(this.quizGroupName, this.inputData);
  }

  private makeid(length:number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

}

/*
 {
   action: "PlayerJoined",
   data: {
     connectionId: "asdfaf"
     name: "Nikola"
   }
 }


*/