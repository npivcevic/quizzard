import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { Question } from '../model/question';
import { QuestionSet } from '../model/question-set';
import { Quiz } from '../model/quiz';
import { QuestionLibraryComponent } from '../question-library/question-library.component';
import { QuestionService } from '../question.service';
import { QuizzesComponent } from '../quizzes/quizzes.component';
import { QuizzesService } from '../services/quizzes.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  constructor(private questionservice: QuestionService,
    private dialog: MatDialog,
    private snack: MatSnackBar) { }

  @Input() questionSetId!: string
  @Input() quizId!: string
  @Input() quiz!: Quiz
  @Input() questionSet!: QuestionSet


  public questions: Question[] = []
  public questionSetList: QuestionSet[] = []


  ngOnInit(): void {
    this.questions = this.questionSet.questions
    this.listOfSetNamesExeptThisOne()
  }

  listOfSetNamesExeptThisOne() {
    this.questionSetList = []
    this.quiz.questionSets.forEach(set => {
      if (set.questionSetId === this.questionSet.questionSetId) {
        return
      }
      this.questionSetList.push(set)
    })
  }

  moveQuestionToAnotherSet(question: Question, _questionSetId: string) {
    this.moveQuestionToAnotherSetOnClient(question, _questionSetId)
    this.moveQuestionToAnotherSetOnBase(question, _questionSetId)
      .subscribe({
        complete: () => {
        }
      })
  }

  moveQuestionToAnotherSetOnBase(question: Question, _questionSetId: string) {

    let x = Object.assign(question, {
      questionSetId: _questionSetId
    })

    return this.questionservice.putQuestion(x)
  }

  moveQuestionToAnotherSetOnClient(question: Question, _questionSetId: string) {
    let oldSet = this.quiz.questionSets.find(set => {
      return set.questionSetId === question.questionSetId
    })
    let questionIndex = oldSet!.questions.findIndex(_question => {
      return question.questionId === _question.questionId
    })
    oldSet?.questions.splice(questionIndex, 1)
    let newSet = this.quiz.questionSets.find(set => {
      return set.questionSetId === _questionSetId
    })
    let x = Object.assign(question, {
      questionSetId: _questionSetId
    })
    newSet?.questions.push(x)
  }

  deleteQuestion(id: string, index: number): void {
    this.questionservice.deleteQuestion(id).subscribe({
      next: () => {
        this.questions.splice(index, 1)
      },
      error: (error) => {
        console.error(error)
        this.openSnackBar("Something went wrong : " + error)
      },
      complete: () => {
        this.openSnackBar("Question is deleted")
      }
    }
    )
  }

  deleteQuestionFromSet(question: Question, index: number): void {

    let questionCopy = Object.assign(question, {
      questionSetId: null
    })
    this.questionservice.putQuestion(questionCopy).subscribe({
      next: (result) => {
        if(result){
          this.questions.splice(index, 1)
          this.openSnackBar("Pitanje je izbrisano iz seta")
        }
      },
      error: (error) => {
        console.error(error)
        this.openSnackBar("Pitanje nije izbrisano iz seta : " + error)
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
          this.openSnackBar("Pitanje je promijenjeno")
        }
      },
      error: (error) => {
        console.error(error)
        this.openSnackBar("Pitanje nije promijenjeno : " + error)
      }
    })
  }

  openPostDialog(): void {
    const dialog = this.dialog.open(AddQuestionComponent, {
      width: '50%',
      data: {
        questionSetId: this.questionSetId,
        quizId: this.quizId,
        order: this.questions.length
      }
    })

    dialog.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.questions.push(result)
          this.openSnackBar("Pitanje je dodano")
        }
      },
      error: (error) => {
        this.openSnackBar("Pitanje nije dodano : " + error)
      }
    })
  }

  openQuestionLibraryDialog() {
    const dialog = this.dialog.open(QuestionLibraryComponent, {
      width: '90%',
      data: this.questionSet
    })

    dialog.afterClosed().subscribe({
      next: (result) => {
        if (!result) {
          return
        }
        result.forEach((q: Question) => {
          this.questions.push(q)
        })
        this.openSnackBar("Question is added")
      },
      error: (error) => {
        this.openSnackBar("Something went wrong : " + error)
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.questions, event.previousIndex, event.currentIndex);

    this.questions.forEach((question, index) => {
      if (question.order === index) {
        return
      }
      let x = Object.assign(question, {
        order: index
      })
      this.questionservice.putQuestion(x)
        .subscribe(data => console.log(data))
    })
  }

  openSnackBar(message: string, duration: number = 2000): void {
    this.snack.open(message, "", { duration: duration });
  }
}
