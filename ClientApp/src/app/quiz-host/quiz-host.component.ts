import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuizHostService } from '../services/quiz-host.service';
import { NavBarService } from '../nav-bar.service';

@Component({
  selector: 'app-quiz-host',
  templateUrl: './quiz-host.component.html',
  styleUrls: ['./quiz-host.component.css']
})
export class QuizHostComponent implements OnInit, OnDestroy {

  inputData: string = "";
  totalTimePerQuestion: number = 12000
  timeLeft: number = 100;
  x: number = Math.ceil(this.totalTimePerQuestion / this.timeLeft)
  curentQuestionIndex: number = -1
  showingCorrectAnswer: boolean = false
  nextQuestionDelay: number = 2000
  

  constructor(public quizHostService: QuizHostService, public navbarservice: NavBarService) { }

  ngOnInit(): void {
    this.navbarservice.visible = false
    this.quizHostService.initialize();
  }

  ngOnDestroy(): void {
    this.navbarservice.visible = true
  }

  startQuiz() {
    this.quizHostService.startQuiz()
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
