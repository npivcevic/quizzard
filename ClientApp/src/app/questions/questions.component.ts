import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { Question } from '../model/question';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  constructor(private questionservice: QuestionService, private dialog: MatDialog, private snack: MatSnackBar) { }

  public questions: Question[] = []

  ngOnInit(): void {
    this.questionservice.getQuestions()
      .subscribe(data => this.questions = data)
  }

  deleteQuestion(id: string, index: number): void {
    this.questionservice.deleteQuestion(id).subscribe({
      next: () => {
        this.questions.splice(index, 1)
        this.openSnackBar("Question is deleted")
      },
      error: (error) => {
        console.error(error)
        this.openSnackBar("Something went wrong")
      }
    }
    )
  }

  openPutDialog(question: Question): void {
    const dialog = this.dialog.open(AddQuestionComponent, {
      data: question,
      width: '50%'
    })

    dialog.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.questions.splice(this.questions.findIndex(x => x.id == question.id), 1, result)
          this.openSnackBar("Question is updated")
        }
      },
      error: (error) => {
        console.error(error)
        this.openSnackBar("Something went wrong")
      }
    })
  }

  openPostDialog(): void {
    const dialog = this.dialog.open(AddQuestionComponent, {
      width: '50%'
    })

    dialog.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.questions.push(result)
          this.openSnackBar("Question is added")
        }
      },
      error: (error) => {
        this.openSnackBar("Something went wrong")
      }
    })
  }

  openSnackBar(message: string, duration: number = 2000): void {
    this.snack.open(message, "", { duration: duration });
  }
}
