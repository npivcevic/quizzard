import { Injectable } from '@angular/core';
import { Question } from './models/question.model';
import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.questions = this.http.get<Question[]>(this.baseUrl + 'api/questions')
  }
  questions!: Observable<Question[]> 
  getQuestions(){
    /*this.http.get<Question[]>(this.baseUrl + 'api/questions').subscribe(result => {
      this.questions = result;
    }, error => console.error(error));
    return this.questions*/
    return this.questions
  }
  deleteQuestion(id: string){
    console.log(this.baseUrl + 'api/questions/'+id)
    this.http.delete(this.baseUrl + 'api/questions/'+id).subscribe(()=>{})
  }

}
