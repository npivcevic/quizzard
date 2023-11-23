import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Question } from '../model/question';
import { letterFromIndex } from '../utils/letterFromIndex';

@Component({
  selector: 'app-quiz-host-question-display',
  templateUrl: './quiz-host-question-display.component.html',
  styleUrls: ['./quiz-host-question-display.component.css']
})
export class QuizHostQuestionDisplayComponent {

  @Input() questionSetName: string = ""
  @Input() currentQuestionNumber: number = 0
  @Input() totalQuestionsInSet: number = 0
  @Input() question!:Question
  @Input() spinnerTimeout: number = 0
  @Input() spinnerText: string = ""
  @Input() showAnswers: boolean = false

  @Output() spinnerElapsed = new EventEmitter<string>();

  getLetter(n: number) {
    return letterFromIndex(n)
  }

  timeout() {
    this.spinnerElapsed.emit()
  }
}
