import { Component, OnInit, Inject } from '@angular/core';
import { PostQuestionSet, QuestionSet } from '../model/question-set';
import { QuestionSetService } from '../services/question-set.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-question-set',
  templateUrl: './add-question-set.component.html',
  styleUrls: ['./add-question-set.component.css']
})
export class AddQuestionSetComponent implements OnInit {

  questionSetForm = this.fb.group({
    name: this.fb.control(null, [Validators.required]),
    order: this.fb.control(null),
    questionSetId: this.fb.control(""),
    questions: this.fb.array([]),
    quizId: this.fb.control("", [Validators.required])
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: QuestionSet, 
              public fb: UntypedFormBuilder, 
              private questionsetservice: QuestionSetService, 
              private dialogRef: MatDialogRef<AddQuestionSetComponent>) { }

  isNew!: boolean

  ngOnInit(): void {
    if (this.data.name) {
      this.isNew = false
      this.questionSetForm.patchValue(this.data)
      return
    }
    this.isNew = true
    this.questionSetForm.removeControl("questionSetId")
    this.questionSetForm.patchValue({
      quizId:this.data.quizId,
      order:this.data.order
    })
  }

  saveQuestionSet(questionSet:QuestionSet){
    if(this.isNew){
      this.postQuestionSet(questionSet)
      return
    }
    this.putQuestionSet(questionSet)
  }

  postQuestionSet(questionSet: PostQuestionSet): void {
    this.questionsetservice.postQuestionSet(questionSet)
      .subscribe({
        next: (data)=>{
          this.dialogRef.close(data)
        },
        error: (error)=>{
        }
      })
  }

  putQuestionSet(questionSet: any): void {
    this.questionsetservice.putQuestionSet(questionSet)
      .subscribe(() => { this.dialogRef.close(questionSet) })
  }

  closeDialog(): void {
    this.dialogRef.close()
  }
}
