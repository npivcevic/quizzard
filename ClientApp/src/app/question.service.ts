import { Injectable, Inject } from '@angular/core';
import { Question } from './model/question';
import { Questions } from './model/questions';
import { PostQuestion } from './model/post-question';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http : HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  question:Question={
    id:"",
    text: "",
    answers:[
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false}
    ]
  }
  postquestion: PostQuestion={
    text:"",
    answers:[
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false}
    ]
  }


  postQuestion(x: PostQuestion){
    console.log(this.postquestion)
    this.http.post(this.baseUrl+"api/Questions", x)
    .subscribe((response)=>{
      console.log(response)
    })
  }

  getQuestions():Observable<Questions[]>{

    return this.http.get<Questions[]>(this.baseUrl+"api/Questions")
  }

  deleteQuestion(id:string){

    this.http.delete(this.baseUrl+"api/Questions/"+id).subscribe(()=>[])
  }

}
