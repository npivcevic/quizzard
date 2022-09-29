import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Question } from '../model/question';
import { PutQuestionComponent } from '../put-question/put-question.component';
import { QuestionService } from '../question.service';


@Component({
  selector: 'app-delete-question',
  templateUrl: './delete-question.component.html',
  styleUrls: ['./delete-question.component.css']
})
export class DeleteQuestionComponent implements OnInit {

  constructor(private questionservice:QuestionService, private dialog: MatDialog) { }

  public questions: Question [] = []

  ngOnInit(): void {

    this.questionservice.getQuestions().
    subscribe(data => this.questions = data)
  
  }

  deleteQuestion(id:string){
    this.questionservice.deleteQuestion(id)

    this.questionservice.getQuestions().
    subscribe(data => this.questions = data)
  }

  openDialog(question: Question){
    this.dialog.open(PutQuestionComponent, {data: question})
      return false
  }

}
