import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question } from '../model/question';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-put-question',
  templateUrl: './put-question.component.html',
  styleUrls: ['./put-question.component.css']
})
export class PutQuestionComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:Question, private questionservice : QuestionService) { }
  
  ngOnInit(): void {
  }

  test(id:string, x:Question){
    console.log(this.data)
    this.questionservice.putQuestion(id, x)
  } 
}
