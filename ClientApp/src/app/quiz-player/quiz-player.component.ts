import { Component, OnInit } from '@angular/core';
import { Player } from '../model/player';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-quiz-player',
  templateUrl: './quiz-player.component.html',
  styleUrls: ['./quiz-player.component.css']
})
export class QuizPlayerComponent implements OnInit {

  quizGroupName: string = "";
  inputCode: string = "";
  inputData: string = "";
  playerName: string = "";

  constructor(public signalRService: SignalrService) { }

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.addTransferDataListener();
  }

  public joinQuiz() {
    console.log('join quiz group name', this.quizGroupName)
    this.signalRService.joinQuiz(this.quizGroupName, this.playerName)
  }

  public sendDataToHost() {
    console.log('input', this.inputData)
    this.signalRService.sendToHost(this.inputData);
  }

}
