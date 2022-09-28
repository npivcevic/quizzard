import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Question } from '../model/question';
import { Questions } from '../model/questions';
import { PutQuestionComponent } from '../put-question/put-question.component';
import { QuestionService } from '../question.service';



@Component({
  selector: 'app-delete-question',
  templateUrl: './delete-question.component.html',
  styleUrls: ['./delete-question.component.css']
})
export class DeleteQuestionComponent implements OnInit {

  constructor(private questionservice:QuestionService, private dialog: MatDialog) { }

  public questions: Questions [] = []

  ngOnInit(): void {

    this.questionservice.getQuestions().
    subscribe(data => this.questions = data)
  
  }

  deleteQuestion(id:string){
    this.questionservice.deleteQuestion(id)

    this.questionservice.getQuestions().
    subscribe(data => this.questions = data)
  }

  openDialog(q:string,w:string,e:string,r:string,t:string){
    this.dialog.open(PutQuestionComponent,
      {
        data:{
          text: q,
          answer1: w,
          answer2: e,
          answer3: r,
          answer4: t
        }
      })
      return false
  }

}
