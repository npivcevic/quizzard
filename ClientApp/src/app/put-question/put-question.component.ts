import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question } from '../model/question';

@Component({
  selector: 'app-put-question',
  templateUrl: './put-question.component.html',
  styleUrls: ['./put-question.component.css']
})
export class PutQuestionComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:Question) { }
  
  ngOnInit(): void {
    console.log(this.data)
  }
 
}
