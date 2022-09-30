import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { Question } from '../model/question';
import { PutQuestionComponent } from '../put-question/put-question.component';
import { QuestionService } from '../question.service';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  constructor(private questionservice:QuestionService, private dialog: MatDialog, private snack: MatSnackBar) { }

  public questions: Question [] = []

  ngOnInit(): void {

    this.questionservice.getQuestions().
    subscribe(data => this.questions = data)
  
  }

  deleteQuestion(id:string){
    this.questionservice.deleteQuestion(id)

    this.openSnackBar()

    this.questionservice.getQuestions().
    subscribe(data => this.questions = data)
  }

  openPutDialog(question: Question){
    this.dialog.open(PutQuestionComponent, {data: question})
      return false
  }

  openPostDialog(){
    this.dialog.open(AddQuestionComponent,{
      width: '50%'
    })
  }
  

  openSnackBar() {
    this.snack.openFromComponent(DeleteMessage, {
      duration: 2000,
    });
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<p align="center" >Question Deleted</p>'

})
export class DeleteMessage {}
