import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizzesService } from '../services/quizzes.service';
import { Quiz } from '../model/quiz';
import { letterFromIndex } from '../utils/letterFromIndex';
import { QuestionSet } from '../model/question-set';

@Component({
  selector: 'app-quiz-preview',
  templateUrl: './quiz-preview.component.html',
  styleUrls: ['./quiz-preview.component.css']
})
export class QuizPreviewComponent {

  @Input() quiz!:Quiz

  displayedColumns: string[] = ['name', "questions"];
  
  constructor(private route: ActivatedRoute,
              private quizservice: QuizzesService){}

  getTotalCost() {
    return this.quiz.questionSets.map(t => t.questions.length).reduce((acc, value) => acc + value, 0);
  }

  getLetter(n: number) {
    return letterFromIndex(n)
  }
}
