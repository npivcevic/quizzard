import { Component, OnInit } from '@angular/core';
import { Question } from '../model/question';
import { QuestionService } from '../question.service';


@Component({
  selector: 'app-delete-question',
  templateUrl: './delete-question.component.html',
  styleUrls: ['./delete-question.component.css']
})
export class DeleteQuestionComponent implements OnInit {

  constructor(private questionservice:QuestionService) { }

  public questions: Question[] = []

  ngOnInit(): void {

    this.questionservice.getQuestions().
    subscribe(data => this.questions = data)
  
  }

  deleteQuestion(id:string){
    this.questionservice.deleteQuestion(id)
  }



}
