import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizzesService } from '../services/quizzes.service';
import { Quiz } from '../model/quiz';
import { QuizSettings } from '../model/QuizSettings';

@Component({
  selector: 'app-quiz-preview',
  templateUrl: './quiz-preview.component.html',
  styleUrls: ['./quiz-preview.component.css']
})
export class QuizPreviewComponent {

  @Input() quiz!: Quiz
  @Input() quizSettings!: QuizSettings

  @Output() openSettings = new EventEmitter<string>();

  displayedColumns: string[] = ['name', "questions"];

  constructor(private route: ActivatedRoute,
    private quizservice: QuizzesService) { }

  getTotalCost() {
    return this.getTotalNumberOfQuestions()
  }

  getTotalNumberOfQuestions() {
    return this.quiz.questionSets.map(t => t.questions.length).reduce((acc, value) => acc + value, 0);
  }

  getTotalNumberOfSets() {
    return this.quiz.questionSets.length;
  }

  settingsIconClicked() {
    this.openSettings.emit()
  }
}
