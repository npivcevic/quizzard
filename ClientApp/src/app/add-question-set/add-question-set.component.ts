import { Component, OnInit, Inject } from '@angular/core';
import { QuestionSet } from '../model/question-set';
import { QuestionSetService } from '../services/question-set.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-question-set',
  templateUrl: './add-question-set.component.html',
  styleUrls: ['./add-question-set.component.css']
})
export class AddQuestionSetComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: QuestionSet, private questionsetservice: QuestionSetService, private dialogRef: MatDialogRef<AddQuestionSetComponent>) { }

  ngOnInit(): void {
  }

}
