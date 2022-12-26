import { Component, OnInit } from '@angular/core';
import { Quiz } from '../model/quiz';
import { QuizzesService } from '../services/quizzes.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AddQuizComponent } from '../add-quiz/add-quiz.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class QuizzesComponent implements OnInit {

  constructor(private router: Router,
    private quizservice: QuizzesService,
    private dialog: MatDialog,
    private snack: MatSnackBar) { }

  quizzes!: Quiz[]
  quizCreatorMode: boolean = false

  name!: string
  description!: string
  quizId!: string

  displayedColumns: string[] = ['select', 'name', 'numberOfQuestions']
  dataSource = new MatTableDataSource<Quiz>(this.quizzes);
  selection = new SelectionModel<Quiz>(true, []);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand', 'delete'];
  expandedElement!: Quiz | null;

  ngOnInit(): void {

    this.quizservice.getQuizzes()
      .subscribe(data => this.dataSource.data = data)
  }

  openPostQuizDialog(): void {
    const dialog = this.dialog.open(AddQuizComponent, {
      width: '90%',
    })

    dialog.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.name = result.name
          this.description = result.description
          this.quizId = result.quizId
          this.quizservice.getQuizzes()
            .subscribe({
            })
          this.openSnackBar("Kviz je stvoren")

        }
      },
      error: (error) => {
        this.openSnackBar("Kviz nije stvoren")
      }
    })
  }

  deleteQuiz(id: string): void {
    this.quizservice.deleteQuiz(id).subscribe({
      next: () => {
        this.quizservice.getQuizzes()
          .subscribe(data => this.dataSource.data = data)
        this.openSnackBar("Kviz je izbrisan")
      },
      error: (error) => {
        console.log(error)
        this.openSnackBar(`Kviz nije izbrisan. Error: ${error.statusText},${error.status} `)
      }
    }
    )
  }

  numberOfSetsInQuiz(quizId:string){
    
    this.quizservice.getQuiz(quizId)
      .subscribe(data=>{
        return data.questionSets.length
      })
  }

  editQuiz(quiz: Quiz) {
    this.router.navigate(['quizzes', quiz.quizId]);
  }


  openSnackBar(message: string, duration: number = 2000): void {
    this.snack.open(message, "", { duration: duration });
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
  checkboxLabel(row?: Quiz): string {
    if (!row) {

      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }
}
