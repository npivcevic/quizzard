import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostQuestion, Question } from '../model/question';
import { QuestionService } from '../question.service';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';

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
      // this.question = JSON.parse(JSON.stringify(this.data))
      // this.addExistingAnswers();
      return
    }
    // this.addNewAnswers()
  }

  question = this.fb.group({
    // id: new FormControl(""),
    text: new FormControl(""),
    answers: this.fb.array([
      this.fb.group({
        text: new FormControl(""),
        isCorrect: new FormControl(false)
      }),
      this.fb.group({
        text: new FormControl(""),
        isCorrect: new FormControl(false)
      }),     
      this.fb.group({
        text: new FormControl(""),
        isCorrect: new FormControl(false)
      }),     
      this.fb.group({
        text: new FormControl(""),
        isCorrect: new FormControl(false)
      })
    ])
  })

  // answer = this.fb.group({
  //   text: new FormControl(""),
  //   isCorrect: new FormControl(null)
  // })

  get answers():FormArray {
    return this.question.controls["answers"] as FormArray;
  }

  // addExistingAnswers() {
  //   this.data.answers.forEach((x) =>
  //     this.answers.push(this.answer)
  //   )

  // }

  // addNewAnswers() {
  //   for (let i = 0; i < 4; i++) {
  //     this.answers.push(this.answer, )
  //   }
  // }

  submit() {
    console.log(this.question.value)
  }

  defaultValues(){
    this.question.patchValue({
      id:this.data.id,
      text:this.data.text,
      answers: this.data.answers
    })
  }

  saveQuestion(): void {
    if (this.isNew) {
      this.postQuestion(this.question.value)
      console.log(this.question.value)
      return
    }
    this.putQuestion(this.question.value)
    console.log(this.question.value)

  }

  postQuestion(question: PostQuestion): void {
    this.questionservice.postQuestion(question)
      .subscribe((result) => { this.dialogRef.close(result) })
  }

  putQuestion(question: Question): void {
    this.questionservice.putQuestion(question)
      .subscribe(() => { this.dialogRef.close(this.question.value) })
  }

  // untoggleAllAnswers(): void {
  //   this.question.answers.forEach(q => {
  //     q.isCorrect = false
  //   });
  // }

}

