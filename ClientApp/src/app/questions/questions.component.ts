import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
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

  public pageSlice = this.questions.slice(0,3);

  ngOnInit(): void {
    this.questionservice.getQuestions().
    subscribe(data => {
      this.questions = data
      this.pageSlice = this.questions.slice(0,3);
    })
  }

  deleteQuestion(id:string, index:number){
    this.questionservice.deleteQuestion(id).subscribe(()=>{
      this.questions.splice(index, 1)
      this.openSnackBar("Question is deleted",2000)
      this.pageSlice = this.questions.slice(0,3);
    },(error)=>{
      console.log(error)
     this.openSnackBar("Something went wrong",2000)
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
        this.openSnackBar("Question is updated",2000)
      }
    },(error)=>{
        this.openSnackBar("Something went wrong",2000)
      })
  }

  openPostDialog(){
    const dialog = this.dialog.open(AddQuestionComponent,{
      width: '50%'
    })

    dialog.afterClosed().subscribe(result =>{
      if(result){
        this.questions.push(result)
        this.openSnackBar("Question is added",2000)
        this.pageSlice = this.questions.slice(0,3);
      }
    },(error)=>{
      this.openSnackBar("Something went wrong",2000)
    }
    )
  }
  
  openSnackBar(message:string, duration:number) {
    this.snack.open(message,"",{duration:duration});
  }

  onPageChange( event : PageEvent){

    const startIndex = event.pageIndex*event.pageSize
    let endIndex = startIndex+event.pageSize
    if(endIndex > this.questions.length){
      endIndex = this.questions.length;
    }
    this.pageSlice = this.questions.slice(startIndex, endIndex)
  }

  searchValue:string = "";

  onSearchValueInput(x:string){
    this.searchValue = x ;
    console.log(this.searchValue)
  }
}
