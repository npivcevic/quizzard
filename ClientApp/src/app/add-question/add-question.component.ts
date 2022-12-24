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

  constructor(@Inject(MAT_DIALOG_DATA) public data: Question, 
              private questionservice: QuestionService, 
              private dialogRef: MatDialogRef<AddQuestionComponent>) { 
                dialogRef.disableClose = true
              }

  isNew: boolean = true

  question: PostQuestion | Question = {
    text: "",
    order: this.data.order,
    answers: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false }
    ],
    questionSetId:this.data.questionSetId
  }

  ngOnInit(): void {
    if (this.data.questionId) {
      this.isNew = false
      this.question = this.copyQuestion(this.data)
    }
  }

  copyQuestion(question:Question) {
    let qCopy = Object.assign({}, question)
    qCopy.answers = question.answers.map((answer) => {
        return {
            id: answer.answerId,
            text: answer.text,
            isCorrect: answer.isCorrect
        }
    })
    return qCopy
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

  closeDialog(){
    this.dialogRef.close()
  }

  untoggleAllAnswers(): void {
    this.question.answers.forEach(q => {
      q.isCorrect = false
    });
  }
}
