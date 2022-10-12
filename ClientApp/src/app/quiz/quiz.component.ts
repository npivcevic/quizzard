import { Question } from './../model/question';
import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  constructor( private questionservice:QuestionService, private fb:FormBuilder) { }

  public questions:Question[]=[];
  currentQuestionIndex:number=0;

  ngOnInit(): void {
    this.questionservice.getQuestions()
      .subscribe(data => {
        this.questions = data
        console.log(this.questions)
      })
  }

}
