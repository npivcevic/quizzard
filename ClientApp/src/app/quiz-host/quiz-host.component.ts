import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from '../model/player';
import { QuizHostService } from '../services/quiz-host.service';
import { QuizPlayerService } from '../services/quiz-player.service';
import { QuestionsComponent } from '../questions/questions.component';
import { NavBarService } from '../nav-bar.service';

@Component({
  selector: 'app-quiz-host',
  templateUrl: './quiz-host.component.html',
  styleUrls: ['./quiz-host.component.css']
})
export class QuizHostComponent implements OnInit, OnDestroy {

  inputData: string = "";
  quizStarted: boolean = false
  totalTimePerQuestion: number = 20000
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
    this.quizStarted = true
    this.nextQuestion();
  }

  showCorrectAnswer() {
    this.showingCorrectAnswer = true
    setTimeout(() => this.nextQuestion(), this.nextQuestionDelay)
  }

  nextQuestion() {
    this.curentQuestionIndex++
    this.showingCorrectAnswer = false
    this.timeLeft = 100
    let ref = setInterval(() => {
      this.timeLeft -= 0.5
      this.x = Math.ceil(this.totalTimePerQuestion * this.timeLeft / 100000)
      if (this.timeLeft <= 0) {
        clearInterval(ref)
        this.showCorrectAnswer()
      }
    }, this.totalTimePerQuestion / (100 * 2));

  }


  public sendDataToGroup() {
    console.log('input', this.inputData)
    const data = {
      action: "Message",
      data: this.inputData
    }
    this.quizHostService.sendToGroup(JSON.stringify(data));
  }

  public startGroupQuiz(){
    const data = {
      action: "Start quiz",
      data: true
    }
    this.quizHostService.sendToGroup(JSON.stringify(data));
  }

  generateGroupCode() {
    this.quizHostService.initialize()
  }
}
