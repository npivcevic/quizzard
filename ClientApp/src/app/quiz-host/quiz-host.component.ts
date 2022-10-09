import { Component, OnInit } from '@angular/core';
import { Player } from '../model/player';
import { QuizHostService } from '../services/quiz-host.service';
import { QuizPlayerService } from '../services/quiz-player.service';

@Component({
  selector: 'app-quiz-host',
  templateUrl: './quiz-host.component.html',
  styleUrls: ['./quiz-host.component.css']
})
export class QuizHostComponent implements OnInit {

  inputData: string = "";

  constructor(public quizHostService: QuizHostService) { }

  ngOnInit(): void {
    this.quizHostService.initialize();
  }

  public sendDataToGroup() {
    console.log('input', this.inputData)
    const data = {
      action: "Message",
      data: this.inputData
    }
    this.quizHostService.sendToGroup(JSON.stringify(data));
  }
}
