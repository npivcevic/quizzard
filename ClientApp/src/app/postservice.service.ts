import { Injectable, Inject } from '@angular/core';
import { Question } from './model/question';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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
    console.log(this.question)
    this.http.post(this.baseUrl+"api/Questions", x)
    .subscribe((response)=>{
      console.log(response)
    })
  }

  getQuestions():Observable<Question[]>{

    return this.http.get<Question[]>(this.baseUrl+"api/Questions")
  }

}
