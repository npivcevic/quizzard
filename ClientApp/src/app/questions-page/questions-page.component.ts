import { Component, OnInit } from '@angular/core';
import {QuestionsService} from '../questions.service'
import { Question } from '../models/question.model';
import { Observable } from 'rxjs';
import { AddQuestionComponent } from '../add-question/add-question.component';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.css']
})
export class QuestionsPageComponent implements OnInit {

  questions!: Observable<Question[]>;
  constructor(private questionsService: QuestionsService) { 

  }

  ngOnInit(): void {
    this.questions = this.questionsService.getQuestions()
    
  }
  deleteQuestion(id:string){
    console.log(id)
    this.questionsService.deleteQuestion(id)
  }
}
