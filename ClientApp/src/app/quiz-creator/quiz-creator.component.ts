import { Component, Input, OnInit } from '@angular/core';
import { QuestionSet } from 'src/app/model/question-set';
import { QuestionSetService } from 'src/app/services/question-set.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionSetComponent } from '../add-question-set/add-question-set.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuizzesService } from '../services/quizzes.service';



@Component({
  selector: 'app-quiz-creator',
  templateUrl: './quiz-creator.component.html',
  styleUrls: ['./quiz-creator.component.css']
})
export class QuizCreatorComponent implements OnInit {

  constructor(public questionsetservice: QuestionSetService, public quizservice: QuizzesService, private dialog: MatDialog, private snack: MatSnackBar) { }

  @Input() name!: string
  @Input() description!: string
  @Input() quizId!: string

  questionSets!: QuestionSet[]
  questionSetsForQuiz: QuestionSet[] = []
  questionSetPreview!: QuestionSet



  ngOnInit(): void {
    this.questionsetservice.getQuestionSets()
      .subscribe(data => {
        this.questionSets = data
      })

  }

  getQuestionSetPreview(questionSetId: string) {
    this.questionsetservice.getQuestionSet(questionSetId)
      .subscribe(
        {
          next: result => {
            this.questionSetPreview = result
            console.log(result)
          }
        }
      )
  }

  getQuestionSets() {
    this.questionsetservice.getQuestionSets()
      .subscribe({
        next: data => {
          this.questionSets = data
        }
      })
  }

  checkForSetInSetsForQuiz(questionSetId: string) {
    return this.questionSetsForQuiz.find(questionSet => {
      return questionSet.questionSetId === questionSetId
    }
    )
  }

  removeSetFromSetsForQuiz(questionSetId: string) {
    const index = this.questionSetsForQuiz.findIndex(questionSet => {
      return questionSet.questionSetId === questionSetId
    })

    this.questionSetsForQuiz.splice(index, 1)
  }

  removeSetFromSets(questionSetId: string) {
    const index = this.questionSets.findIndex(questionSet => {
      return questionSet.questionSetId === questionSetId
    })

    this.questionSets.splice(index, 1)
  }

  deleteQuestionSet(questionSetId: string) {
    this.questionsetservice.deleteQuestionSet(questionSetId)
      .subscribe({
        complete: () => {
          if (this.checkForSetInSetsForQuiz(questionSetId)) {
            return this.removeSetFromSetsForQuiz(questionSetId)
          }
          return this.removeSetFromSets(questionSetId)
        }
      })
  }

  openPostQuestionSetDialog(): void {
    const dialog = this.dialog.open(AddQuestionSetComponent, {
      width: '50%',

    })

    dialog.afterOpened().subscribe({
      next: result => {
        console.log(result)
      }
    })

    dialog.afterClosed().subscribe({
      next: result => {
        if (result) {
          console.log(result)
        }
      },
      error: (error) => {
        this.openSnackBar("Set nije spremljen")
      }
    })
  }

  openSnackBar(message: string, duration: number = 2000): void {
    this.snack.open(message, "", { duration: duration });
  }

  drop(event: CdkDragDrop<QuestionSet[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    console.log("pitanja za kviz", this.questionSetsForQuiz)
  }

}
