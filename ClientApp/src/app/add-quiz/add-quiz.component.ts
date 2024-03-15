import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Quiz } from '../model/quiz';
import { QuizzesService } from '../services/quizzes.service';
import { Router } from '@angular/router';
import { QuestionSetService } from '../services/question-set.service';
import { PostQuestionSet } from '../model/question-set';
import { QuizStatuses } from '../model/QuizStatus';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css']
})
export class AddQuizComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Quiz,
    private router: Router,
    public fb: FormBuilder,
    private questionsetservice: QuestionSetService,
    private quizzesService: QuizzesService,
    private dialogRef: MatDialogRef<AddQuizComponent>) { }

  defaultQuestionSet: PostQuestionSet = {
    name: "Set 1",
    order: 0,
    questions: [],
    quizId: ""
  }

  quizForm = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required]),
    description: this.fb.nonNullable.control(''),
    status: this.fb.nonNullable.control(0, [Validators.required]),
    publishDate: this.fb.control(new Date(Date.now()))
  })

  isNew!: boolean
  quizStatuses = QuizStatuses

  ngOnInit(): void {
    if (this.data) {
      this.isNew = false
      this.quizForm.setValue({
        name: this.data.name,
        description: this.data.description,
        status: this.data.status,
        publishDate: this.data.publishDate
      })
      return
    }
    this.isNew = true
  }

  save(): void {
    if (!this.isNew) {
      this.updateQuiz()
      return
    }
    this.createQuiz()
  }

  updateQuiz() {
    this.quizzesService.putQuiz(Object.assign(this.quizForm.getRawValue(), {
      quizId: this.data.quizId
    }))
      .subscribe({
        error: (err) => {
        },
        complete: () => {
          this.dialogRef.close("OK")
        }
      })
  }

  createQuiz(): void {
    this.quizzesService.postQuiz(this.quizForm.getRawValue())
      .subscribe({
        next: (result) => {
          this.dialogRef.close(result)
          this.defaultQuestionSet.quizId = result.quizId
          this.createDeafulatQuestionSet()
        }
      })
  }

  createDeafulatQuestionSet() {
    this.questionsetservice.postQuestionSet(this.defaultQuestionSet)
      .subscribe({
        next: () => {
          this.router.navigate(['quizzes', this.defaultQuestionSet.quizId])
          return
        }
      })
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
