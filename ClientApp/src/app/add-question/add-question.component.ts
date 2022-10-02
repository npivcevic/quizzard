import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { Answer } from '../model/answer';
import { PostQuestion, Question } from '../model/question';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data:Question, private questionservice : QuestionService, private dialogRef :MatDialogRef<AddQuestionComponent>) { }

  ngOnInit(): void {

    if(this.data){
      this.isNew=false
      this.question=JSON.parse(JSON.stringify(this.data))
      console.log(this.question)
    }
  
  }

  isNew:boolean = true

  question: PostQuestion | Question={
    text: "",
    answers:[
      {text:"", isCorrect:true},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false}
    ]
  }

  saveQuestion(){
    if(this.isNew){
      return this.postQuestion(this.question)
    }
    return this.putQuestion(this.question)
  }


  postQuestion(x: PostQuestion){
    this.questionservice.postQuestion(x)
    .subscribe((result)=>{ this.dialogRef.close(result)})
  }

  putQuestion(questionTemp:any){
   this.questionservice.putQuestion(questionTemp)
    .subscribe(()=>{this.dialogRef.close(this.question)})
  }

  singleToggle(){
    this.question.answers.forEach(a => {
      a.isCorrect=false
    });
  }

}

