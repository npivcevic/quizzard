import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizzesService } from '../services/quizzes.service';
import { Quiz } from '../model/quiz';
import { letterFromIndex } from '../utils/letterFromIndex';

@Component({
  selector: 'app-quiz-preview',
  templateUrl: './quiz-preview.component.html',
  styleUrls: ['./quiz-preview.component.css']
})
export class QuizPreviewComponent implements OnInit {

  @Input() quiz!:Quiz
  
  constructor(private route: ActivatedRoute,
              private quizservice: QuizzesService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')
      if (!id) {
        return
      }
      this.quizservice.getQuiz(id)
        .subscribe({
          next: (data) => {
            this.quiz = data
          }
        })
    })
  }

  getLetter(n: number) {
    return letterFromIndex(n)
  }
}
