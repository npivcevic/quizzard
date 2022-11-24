import { Component, OnInit } from '@angular/core';
import { Quiz } from '../model/quiz';
import { QuizzesService } from '../services/quizzes.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { AddQuizComponent } from '../add-quiz/add-quiz.component';


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

  constructor(private quizservice: QuizzesService,  private dialog: MatDialog ,private snack: MatSnackBar) { }

  quizzes!: Quiz[]

  displayedColumns: string[] = ['select', 'name', 'numberOfQuestions']
  dataSource = new MatTableDataSource<Quiz>(this.quizzes);
  selection = new SelectionModel<Quiz>(true, []);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand', 'delete'];
  expandedElement!: Quiz | null;

  ngOnInit(): void {

    this.quizservice.getQuizzes()
      .subscribe(data => this.dataSource.data = data)
  }

  openPostQuizDialog():void {
    const dialog = this.dialog.open(AddQuizComponent, {
      width: '50%',
    })

    dialog.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.quizservice.getQuizzes()
            .subscribe(data => this.dataSource.data = data)
          this.openSnackBar("Kviz je spremljen")
        }
      },
      error: (error) => {
        this.openSnackBar("Kviz nije spremljen")
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

