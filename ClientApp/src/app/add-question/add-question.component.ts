import { Answer } from './../model/answer';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostQuestion, Question } from '../model/question';
import { QuestionService } from '../question.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: Question, private questionservice: QuestionService, private dialogRef: MatDialogRef<AddQuestionComponent>) { }

  isNew: boolean = true

  question: PostQuestion | Question = {
    text: "",
    answers: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false }
    ]
  }

  
  ngOnInit(): void {

    if (this.data) {
      this.isNew = false
      this.question = JSON.parse(JSON.stringify(this.data))
    }

  }

  PostQuestionForm = new FormGroup({
    question_text:new FormControl("",[Validators.required]),
    answer_text0:new FormControl("",[Validators.required]),
    answer_isCorrect0:new FormControl(""),
    answer_text1:new FormControl("",[Validators.required]),
    answer_isCorrect1:new FormControl(""),
    answer_text2:new FormControl("",[Validators.required]),
    answer_isCorrect2:new FormControl(""),
    answer_text3:new FormControl("",[Validators.required]),
    answer_isCorrect3:new FormControl("")
  })

  saveQuestion() {
    if (this.isNew && this.PostQuestionForm.invalid==false) {
      this.postQuestion(this.question)
      return
    } else if (this.PostQuestionForm.invalid==false){
      this.putQuestion(this.question)
    }
    console.log(this.PostQuestionForm.value)
    
  }


  postQuestion(x: PostQuestion): void {
    this.questionservice.postQuestion(x)
      .subscribe((result) => { this.dialogRef.close(result) })
  }

  putQuestion(questionTemp: any): void {
    this.questionservice.putQuestion(questionTemp)
      .subscribe(() => { this.dialogRef.close(this.question) })
  }

  singleToggle() {
    this.question.answers.forEach(a => {
      a.isCorrect = false
    });
  }

}
