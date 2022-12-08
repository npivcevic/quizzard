import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { Question } from '../model/question';
import { QuestionService } from '../question.service';
import { QuizzesComponent } from '../quizzes/quizzes.component';
import { QuizzesService } from '../services/quizzes.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  constructor(private questionservice: QuestionService, private quizservice: QuizzesService, private dialog: MatDialog, private snack: MatSnackBar) { }

  @Input() questionSetId!: string
  @Input() quizId!: string


  public questions: Question[] = []


  ngOnInit(): void {
    // this.questionservice.getQuestions()
    //   .subscribe(data => this.questions = data)

    this.quizservice.getQuiz(this.quizId)
      .subscribe(data => {
        const x = data.questionSets.find(set => {
          return set.questionSetId === this.questionSetId
        })
        this.questions = x!.questions
      })
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
          this.questions.splice(this.questions.findIndex(x => x.questionId == question.questionId), 1, result)
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
      width: '50%',
      data: {
        questionSetId: this.questionSetId,
        quizId: this.quizId
      }
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.questions, event.previousIndex, event.currentIndex);
  }

  openSnackBar(message: string, duration: number = 2000): void {
    this.snack.open(message, "", { duration: duration });
  }
}
