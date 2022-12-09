import { Component, Inject, Input, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question } from '../model/question';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Answer } from '../model/answer';


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
              private dialogRef: MatDialogRef<QuestionLibraryComponent>) { }

  @Input() questionSetId:string = this.data.questionSetId
  @Input() quizId:string = this.data.quizId

  public questions:Question[] = []
  public selected : Question[] = []

  displayedColumns: string[] = ['select', 'name']
  dataSource = new MatTableDataSource<Question>(this.questions);
  selection = new SelectionModel<Question>(true, []);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand', 'delete'];
  expandedElement!: Answer[] | null;

  ngOnInit(): void {
    console.log("wwwe", this.questionSetId)
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

  addQuestionsToQuestionSet(questionSetId:string){
    this.selected.forEach(q=>{
      let x = Object.assign(q,{
        questionSetId: questionSetId
      })
      console.log(x)
      this.questionservice.putQuestion(x)
        .subscribe({
          next:()=>{
            this.dialogRef.close(this.selected)
          }
        }
        )
    })
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
  checkboxLabel(row?: Question): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;

    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.text + 1}`;
  }

}
