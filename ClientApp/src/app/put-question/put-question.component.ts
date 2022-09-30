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

  question:Question={
    id:this.data.id,
    text:this.data.text,
    answers:[
      {text:this.data.answers[0].text,isCorrect:this.data.answers[0].isCorrect},
      {text:this.data.answers[1].text,isCorrect:this.data.answers[1].isCorrect},
      {text:this.data.answers[2].text,isCorrect:this.data.answers[2].isCorrect},
      {text:this.data.answers[3].text,isCorrect:this.data.answers[3].isCorrect}
    ]
  }

  putQuestion(id:string, questionTemp:Question){

   this.questionservice.putQuestion(id, questionTemp)  
    console.log(this.question)
  }

}
