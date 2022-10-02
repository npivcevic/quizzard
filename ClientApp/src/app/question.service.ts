import { Injectable, Inject } from '@angular/core';
import { Question } from './model/question';
import { PostQuestion } from './model/question';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http : HttpClient, @Inject('BASE_URL') private baseUrl: string,) { }


  postQuestion(x: PostQuestion){
    return this.http.post(this.baseUrl+"api/Questions", x)
     
  }

  getQuestions():Observable<Question[]>{

    return this.http.get<Question[]>(this.baseUrl+"api/Questions")
  }

  deleteQuestion(id:string){

    return this.http.delete(this.baseUrl+"api/Questions/"+id)
  }

  putQuestion(x :Question){
    return this.http.put(this.baseUrl+"api/Questions/"+x.id, x)

}
}

