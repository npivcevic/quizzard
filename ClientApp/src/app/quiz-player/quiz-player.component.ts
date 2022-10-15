import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavBarService } from '../nav-bar.service';
import { QuizPlayerService } from '../services/quiz-player.service';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-quiz-player',
  templateUrl: './quiz-player.component.html',
  styleUrls: ['./quiz-player.component.css']
})
export class QuizPlayerComponent implements OnInit, OnDestroy {

  quizGroupName: string = "";
  inputCode: string = "";
  inputData: string = "";
  playerName: string = "";
  constructor(public quizPlayerService: QuizPlayerService, public navbarservice: NavBarService) { }

  ngOnInit(): void {
    this.quizPlayerService.initialize();
    this.navbarservice.visible = false
  }

  ngOnDestroy(): void {
    this.navbarservice.visible = true
  }

  public joinQuiz() {
    this.quizPlayerService.joinQuiz(this.quizGroupName, this.playerName)
  }

  public sendDataToHost() {
    const data = {
      action: "Message",
      data: this.inputData
    }
    this.quizPlayerService.sendToHost(JSON.stringify(data));
  }

  public sendAnswerToHost(id?:string) {
    this.quizPlayerService.sendAnswerToHost(id)
  }

}
