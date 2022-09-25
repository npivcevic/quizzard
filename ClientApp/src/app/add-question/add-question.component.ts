import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { Question } from '../model/question';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  
  constructor(private http : HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  ngOnInit(): void {
  }

  question:Question={
    text: "",
    answers:[
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false}
    ]
  }
  postQuestion(x: Question){
    
    this.http.post(this.baseUrl+"api/Questions", this.question )
    .subscribe((response)=>{
      console.log(response)
    })
  }

}
