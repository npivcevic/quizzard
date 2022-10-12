import { Component, OnInit } from '@angular/core';
import { Player } from '../model/player';
import { QuizHostService } from '../services/quiz-host.service';
import { QuizPlayerService } from '../services/quiz-player.service';
import { QuestionsComponent } from '../questions/questions.component';

@Component({
  selector: 'app-quiz-host',
  templateUrl: './quiz-host.component.html',
  styleUrls: ['./quiz-host.component.css']
})
export class QuizHostComponent implements OnInit {

  inputData: string = "";
  startQuiz:boolean = false

  constructor(public quizHostService: QuizHostService) { }

  ngOnInit(): void {
    // this.quizHostService.initialize();
  }

  public sendDataToGroup() {
    console.log('input', this.inputData)
    const data = {
      action: "Message",
      data: this.inputData
    }
    this.quizHostService.sendToGroup(JSON.stringify(data));
  }

  generateGroupCode(){
    this.quizHostService.initialize()
  }
}
