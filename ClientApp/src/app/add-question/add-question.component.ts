import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostQuestion, Question } from '../model/question';
import { QuestionService } from '../question.service';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Question, private questionservice: QuestionService, private dialogRef: MatDialogRef<AddQuestionComponent>, private fb: FormBuilder) { }

  isNew: boolean = true

  // question: PostQuestion | Question = {
  //   text: "",
  //   answers: [
  //     { text: "", isCorrect: true },
  //     { text: "", isCorrect: false },
  //     { text: "", isCorrect: false },
  //     { text: "", isCorrect: false }
  //   ]
  // }



  ngOnInit(): void {
    if (this.data) {
      this.isNew = false
      this.question.setControl("id", new FormControl)
      this.defaultValues();
    }
  }

  question = this.fb.group({
    text: this.fb.control("", [Validators.required]),
    answers: this.fb.array([
      this.fb.group({
        text: this.fb.control("", [Validators.required]),
        isCorrect: this.fb.control(true)
      }),
      this.fb.group({
        text: this.fb.control("", [Validators.required]),
        isCorrect: this.fb.control(false)
      }),
      this.fb.group({
        text: this.fb.control("", [Validators.required]),
        isCorrect: this.fb.control(false)
      }),
      this.fb.group({
        text: this.fb.control("", [Validators.required]),
        isCorrect: this.fb.control(false)
      })
    ])
  })

  get answers(): FormArray {
    return this.question.controls["answers"] as FormArray;
  }

  submit() {
    console.log(this.question.value)
  }

  defaultValues() {
    this.question.patchValue({
      id: this.data.id,
      text: this.data.text,
      answers: this.data.answers
    })
  }

  saveQuestion(): void {
    if (this.isNew && this.question.invalid===false) {
      this.postQuestion(this.question.value)
      console.log(this.question.value)
      return
    }else if(this.isNew===false){
      this.putQuestion(this.question.value)
      console.log(this.question.value)
    }
  
  }

  postQuestion(question: PostQuestion): void {
    this.questionservice.postQuestion(question)
      .subscribe((result) => { this.dialogRef.close(result) })
  }

  putQuestion(question: Question): void {
    this.questionservice.putQuestion(question)
      .subscribe(() => { this.dialogRef.close(this.question.value) })
  }

  untoggleAllAnswers(): void {
    this.answers.controls.forEach(q => {
      q.patchValue({
        isCorrect: false
      })
    });
  }

}
