import { Component, OnInit } from '@angular/core';
import {QuestionsService} from '../questions.service'
import { Question } from '../models/question.model';
import { Observable } from 'rxjs';

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

}
