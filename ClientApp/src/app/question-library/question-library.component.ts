import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { QuestionService } from '../question.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question } from '../model/question';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Answer } from '../model/answer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddQuestionComponent } from '../add-question/add-question.component';


@Component({
  selector: 'app-question-library',
  templateUrl: './question-library.component.html',
  styleUrls: ['./question-library.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class QuestionLibraryComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private questionservice: QuestionService, 
              private dialogRef: MatDialogRef<QuestionLibraryComponent>,
              private snack: MatSnackBar,
              private dialog: MatDialog) { }

  @Input() questionSetId:string = this.data.questionSetId
  @Input() quizId:string = this.data.quizId
  @ViewChild(MatTable) table!: MatTable<any>;

  public questions:Question[] = []
  public selected : Question[] = []

  displayedColumns: string[] = ['select', 'name']
  dataSource = new MatTableDataSource<Question>(this.questions);
  selection = new SelectionModel<Question>(true, []);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand', 'delete'];
  expandedElement!: Answer[] | null;

  ngOnInit(): void {
    this.questionservice.getQuestions()
      .subscribe({
        next: (data)=>{
          data.forEach(question=>{
            if(question.questionSetId){
              return
            }
            this.questions.push(question)
            this.dataSource.data = this.questions
          })
        },
      })
  }

  checkbox(el:Question){
    let x = this.selected.find(q=>{
      return q.questionId === el.questionId
    })
    if(x){
        let index = this.selected.findIndex(q =>{
          return q.questionId === el.questionId
        })
      this.selected.splice(index,1)
      return
    }
    this.selected.unshift(el)
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
          this.table.renderRows()
        }
      },
      error: (error) => {
        console.error(error)
        this.openSnackBar("Something went wrong : " + error)
      },
      complete:()=>{
        this.openSnackBar("Question is updated")
      }
    })
  }

  addQuestionsToQuestionSet(questionSetId:string){
    let _order = this.data.questions.length
    let _questions:Question[] = []
    this.selected.forEach(q=>{
      let question = Object.assign(q,{
        questionSetId: questionSetId,
        order: _order
      })
      _questions.push(question)
      this.questionservice.putQuestion(question)
        .subscribe({
          next:()=>{
            this.dialogRef.close(_questions)
          },
          error: (error)=>{
            this.openSnackBar("Question is not deleted : " + error)
          },
          complete:()=> {
            this.openSnackBar("Question is deleted")
          },
        }
        )
    })
  }

  deleteQuestion(_questionId: string): void {
    let index = this.questions.findIndex(q=>{
      return q.questionId === _questionId
    })
    console.log(index)
    this.questionservice.deleteQuestion(_questionId).subscribe({
      next: () => {
        this.dataSource.data.splice(index, 1)
        this.table.renderRows()
      },
      error: (error) => {
        console.error(error)
        this.openSnackBar("Something went wrong : " + error)
      },
      complete : ()=>{
        this.openSnackBar("Question is deleted")
        this.dataSource.data.splice(index, 1)
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
      this.selected = []
      console.log(this.selected)
      return;
    }
    this.selection.select(...this.dataSource.data);
    this.selected = this.questions

    console.log(this.selected)

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Question): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;

    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.text + 1}`;
  }

}
