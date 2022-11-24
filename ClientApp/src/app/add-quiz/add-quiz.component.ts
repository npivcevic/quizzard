import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Quiz } from '../model/quiz';
import { QuizzesService } from '../services/quizzes.service';


@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css']
})
export class AddQuizComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Quiz, public fb: FormBuilder, private quizservice: QuizzesService, private dialogRef: MatDialogRef<AddQuizComponent>) { }

  ngOnInit(): void {
  }

  addQuizForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required])
  })

  saveQuiz(): void {
    this.postQuiz(this.addQuizForm.value)
  }

  postQuiz(quiz: Quiz): void {
    this.quizservice.postQuiz(quiz)
      .subscribe((result) => { this.dialogRef.close(result) })
  }

}
