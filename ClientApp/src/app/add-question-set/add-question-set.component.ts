import { Component, OnInit, Inject } from '@angular/core';
import { PostQuestionSet, QuestionSet } from '../model/question-set';
import { Question } from '../model/question';
import { QuestionSetService } from '../services/question-set.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-question-set',
  templateUrl: './add-question-set.component.html',
  styleUrls: ['./add-question-set.component.css']
})
export class AddQuestionSetComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: QuestionSet, public fb: FormBuilder, private questionsetservice: QuestionSetService, private dialogRef: MatDialogRef<AddQuestionSetComponent>) { }

  isNew!: boolean

  ngOnInit(): void {
    if (this.data.name) {
      this.isNew = false
      this.questionSet = this.data
      this.questionSetForm.setValue(this.questionSet)
      return
    }
    this.isNew = true
    console.log("this is new set")
  }

  questionSet: QuestionSet | PostQuestionSet = {
    name: "",
    order: 0,
    questions: [],
    quizId: this.data.quizId

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
    quizId: this.fb.control(this.data.quizId, [Validators.required])
  })



  get questions() {
    return this.questionSetForm.controls["questions"] as FormArray;
  }

  postQuestionSet(questionSet: PostQuestionSet): void {
    this.questionsetservice.postQuestionSet(questionSet)
      .subscribe((result) => { this.dialogRef.close(result) })
  }

  putQuestionSet(questionSet: any): void {
    this.questionsetservice.putQuestionSet(questionSet)
      .subscribe(() => { this.dialogRef.close(questionSet) })
  }
}
