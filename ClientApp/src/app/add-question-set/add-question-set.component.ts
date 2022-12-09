import { Component, OnInit, Inject } from '@angular/core';
import { PostQuestionSet, QuestionSet } from '../model/question-set';
import { Question } from '../model/question';
import { QuestionSetService } from '../services/question-set.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Quiz } from '../model/quiz';

@Component({
  selector: 'app-add-question-set',
  templateUrl: './add-question-set.component.html',
  styleUrls: ['./add-question-set.component.css']
})
export class AddQuestionSetComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Quiz, public fb: FormBuilder, private questionsetservice: QuestionSetService, private dialogRef: MatDialogRef<AddQuestionSetComponent>) { }

  isNew!: boolean

  ngOnInit(): void {
    if (this.data.name) {
      this.isNew = false
      this.questionSetForm.setValue(this.questionSet)
      return
    }
    this.isNew = true
    this.postQuestionSetForm.patchValue({
      quizId:this.data
    })
  }

  questionSet: QuestionSet | PostQuestionSet = {
    name: "",
    order: 0,
    questions: [],
    quizId: ""

  }

  questionSetForm = this.fb.group({
    name: this.fb.control(null, [Validators.required]),
    order: this.fb.control(null),
    questionSetId: this.fb.control(""),
    questions: this.fb.array([]),
    quiz: this.fb.control(null),
    quizId: this.fb.control("", [Validators.required])
  })

  postQuestionSetForm = this.fb.group({
    name: this.fb.control("", [Validators.required]),
    order: this.fb.control(0),
    questions: this.fb.array([]),
    quizId: this.fb.control("", [Validators.required])
  })


  postQuestionSet(questionSet: PostQuestionSet): void {
    this.questionsetservice.postQuestionSet(questionSet)
      .subscribe({
        next: (data)=>{
          this.dialogRef.close(data)
        },
        error: (err)=>{
          console.log("error :" + err)
        }
      })
  }

  putQuestionSet(questionSet: any): void {
    this.questionsetservice.putQuestionSet(questionSet)
      .subscribe(() => { this.dialogRef.close(questionSet) })
  }
}
