import { Question } from './../model/question';
import { QuestionService } from './../question.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  public quiz: Question[] = []
  score: number = 0
  currentQuestion:number=0

  constructor(private questionservice: QuestionService) { }

  ngOnInit(): void {

    this.questionservice.getQuestions()
      .subscribe((result) => {
        this.quiz = result
      })
  }

  correctAnswer(x:boolean){

    if(x==true){
      this.score++
      console.log(this.score)
      this.currentQuestion++
      return
    }
    this.currentQuestion++
    console.log(this.score)
  }

}
