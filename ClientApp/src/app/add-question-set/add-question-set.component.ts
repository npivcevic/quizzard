import { Component, OnInit, Inject } from '@angular/core';
import { QuestionSet } from '../model/question-set';
import { QuestionSetService } from '../services/question-set.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-question-set',
  templateUrl: './add-question-set.component.html',
  styleUrls: ['./add-question-set.component.css']
})
export class AddQuestionSetComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: QuestionSet, public fb: FormBuilder, private questionsetservice: QuestionSetService, private dialogRef: MatDialogRef<AddQuestionSetComponent>) { }

  questionSet!:QuestionSet

  ngOnInit(): void {
  }

  questionSetForm = this.fb.group({
    name : this.fb.control("",[Validators.required]),
    quizId : this.fb.control("",[Validators.required])
  })



}
