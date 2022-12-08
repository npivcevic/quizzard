import { Component, OnInit } from '@angular/core';
import { QuestionSet } from 'src/app/model/question-set';
import { QuestionSetService } from 'src/app/services/question-set.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionSetComponent } from '../add-question-set/add-question-set.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuizzesService } from '../services/quizzes.service';
import { Quiz } from '../model/quiz';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs';





@Component({
  selector: 'app-quiz-creator',
  templateUrl: './quiz-creator.component.html',
  styleUrls: ['./quiz-creator.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class QuizCreatorComponent implements OnInit {

  constructor(private questionsetservice: QuestionSetService,
    private route: ActivatedRoute,
    private quizservice: QuizzesService,
    private dialog: MatDialog,
    private snack: MatSnackBar) { }

  questionSets!: QuestionSet[]
  questionSetsForQuiz: QuestionSet[] = []
  questionSetPreview!: QuestionSet

  quiz!: Quiz
  quizIsLoaded: boolean = false
  panelOpenState = false;

  displayedColumns: string[] = ['select', 'name']
  dataSource = new MatTableDataSource<QuestionSet>();
  selection = new SelectionModel<QuestionSet>(true, []);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement!: QuestionSet | null;



  ngOnInit(): void {
    this.questionsetservice.getQuestionSets()
      .subscribe(data => {
        this.questionSets = data
      })

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')
      if (!id) {
        return
      }
      this.quizservice.getQuiz(id)
        .subscribe({
          next: (data) => {
            this.quiz = data
            this.dataSource.data = data.questionSets
          },
          complete: () => {
            this.quizIsLoaded = true
            console.log("this is passed to quiz object", this.quiz.questionSets)
          }
        })
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
            this.removeSetFromSetsForQuiz(questionSetId)
            return this.openSnackBar("Set pitanja je izbrisan")
          }
          this.removeSetFromSets(questionSetId)
          return this.openSnackBar("Set pitanja je izbrisan")
        },
        error: (err) => {
          return this.openSnackBar("Set pitanja nije izbrisan")
        }
      })
  }

  openPutQuestionSetDialog(questionSet: QuestionSet): void {
    const dialog = this.dialog.open(AddQuestionSetComponent, {
      width: '50%',
      data: questionSet
    })
    dialog.afterOpened().subscribe({
      next: result => {
        console.log(result)
      }
    })

    dialog.afterClosed().subscribe({
      next: result => {
        if (result) {
          if (this.checkForSetInSetsForQuiz(result.questionSetId)) {
            console.log("pronasa san kviz u toj gupi")
            console.log(this.questionSetsForQuiz)
            this.questionSetsForQuiz.splice(this.questionSetsForQuiz.findIndex(x => x.questionSetId = questionSet.questionSetId), 1, result)
            console.log(this.questionSetsForQuiz)

          }
        }
        this.openSnackBar("Set pitanja je promijenjen")
      }
    })
  }

  openPostQuestionSetDialog(): void {
    const dialog = this.dialog.open(AddQuestionSetComponent, {
      width: '50%',
      data: {
        quizId: this.quiz.quizId
      }

    })

    dialog.afterOpened().subscribe({
      next: result => {
      }
    })

    dialog.afterClosed().subscribe({
      next: result => {
        if (result) {
          console.log(result)
          this.quizservice.getQuiz(result.quizId)
            .subscribe(data => {
              this.quiz = data
            })
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();

      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: QuestionSet): string {
    if (!row) {

      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

}
