import { Component, OnInit } from '@angular/core';
import { Player } from '../model/player';
import { QuizPlayerService } from '../services/quiz-player.service';
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

  constructor(public quizPlayerService: QuizPlayerService) { }

  ngOnInit(): void {
    this.quizPlayerService.initialize();
  }

  public joinQuiz() {
    console.log('join quiz group name', this.quizGroupName)
    this.quizPlayerService.joinQuiz(this.quizGroupName, this.playerName)
  }

  public sendDataToHost() {
    console.log('input', this.inputData)
    const data = {
      action: "Message",
      data: this.inputData
    }
    this.quizPlayerService.sendToHost(JSON.stringify(data));
  }

}
