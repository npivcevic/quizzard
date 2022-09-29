import { Injectable, Inject } from '@angular/core';
import { Question } from './model/question';
import { PostQuestion } from './model/post-question';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http : HttpClient, @Inject('BASE_URL') private baseUrl: string) { }


  postQuestion(x: PostQuestion){
    this.http.post(this.baseUrl+"api/Questions", x)
    .subscribe((response)=>{
      console.log(response)
    })
  }

  getQuestions():Observable<Question[]>{

    return this.http.get<Question[]>(this.baseUrl+"api/Questions")
  }

  deleteQuestion(id:string){

    this.http.delete(this.baseUrl+"api/Questions/"+id).subscribe(()=>[])
  }

<<<<<<< HEAD
<<<<<<< HEAD
    putQuestion(id:string,x :Question){
      this.http.put(this.baseUrl+"api/Questions/"+id, x).subscribe(()=>{})
    }
=======
=======
>>>>>>> 117b5d95cc5cf62301369533b4f96626324becf6
  putquestion(id:string, x :Question){
    this.http.put(this.baseUrl+"api/Questions"+id,x)
  }

<<<<<<< HEAD
>>>>>>> 117b5d95cc5cf62301369533b4f96626324becf6
=======
>>>>>>> 117b5d95cc5cf62301369533b4f96626324becf6
}
