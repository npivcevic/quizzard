import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostQuestion, Question } from '../model/question';
import { QuestionService } from '../question.service';

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

  saveQuestion(): void {
    if (this.isNew) {
      this.postQuestion(this.question)
      return
    }
    this.putQuestion(this.question)
  }

  postQuestion(question: PostQuestion): void {
    this.questionservice.postQuestion(question)
      .subscribe((result) => { this.dialogRef.close(result) })
  }

  putQuestion(question: any): void {
    this.questionservice.putQuestion(question)
      .subscribe(() => { this.dialogRef.close(this.question) })
  }

  untoggleAllAnswers(): void {
    this.question.answers.forEach(q => {
      q.isCorrect = false
    });
  }
}
