import { Injectable, Inject } from '@angular/core';
import { Question } from './model/question';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PostserviceService {

  constructor(private http : HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

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
