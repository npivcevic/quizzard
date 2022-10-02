import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { Question } from '../model/question';
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

  deleteQuestion(id:string, index:number){
    this.questionservice.deleteQuestion(id).subscribe(()=>{
      this.questions.splice(index, 1)
      this.openSnackBar("question is deleted")
    },(error)=>{
      console.log(error)
     this.openSnackBar("Something went wrong")
    }
    )

  }

  openPutDialog(question: Question){
    const dialog = this.dialog.open(AddQuestionComponent, {
      data: question,
      width: '50%'

    })

    dialog.afterClosed().subscribe(result=> {
      if(result){
        this.questions.splice(this.questions.findIndex(x=>x.id==question.id),1,result)
      }
    })
      return false
  }

  openPostDialog(){
    const dialog = this.dialog.open(AddQuestionComponent,{
      width: '50%'
    })

    dialog.afterClosed().subscribe(result =>{
      if(result){
        this.questions.push(result)
      }
    })
  }
  
  openSnackBar(message:string) {
    this.snack.open(message);
  }
}

