import { Component, Input, OnInit } from '@angular/core';
import { shuffle } from '../utils/shuffleArray';
import { QuizHostService } from '../services/quiz-host.service';
import { QuizState } from '../classes/QuizHostData';

@Component({
  selector: 'app-quiz-host-finish-display',
  templateUrl: './quiz-host-finish-display.component.html',
  styleUrls: ['./quiz-host-finish-display.component.css']
})
export class QuizHostFinishDisplayComponent implements OnInit {
  @Input() quizName: string = '';
  @Input() topPlayers: Array<string> = []
  @Input() funFacts: Array<string> = [];

  currentFunFactIndex = 0;
  randomOrderFunFacts: Array<string> = [];

  constructor(private quizHostService: QuizHostService){}

  ngOnInit() {
    if (this.funFacts.length === 0) {
      return;
    }
    this.randomOrderFunFacts = shuffle(this.funFacts)
    setInterval(() => {
        this.currentFunFactIndex === this.randomOrderFunFacts.length - 1
          ? this.currentFunFactIndex = 0 : this.currentFunFactIndex++;
    }, 7000)
  }

  setQuizStateToIdle() {
    this.quizHostService.quizData.quizState.next(QuizState.Idle)
  }


}
