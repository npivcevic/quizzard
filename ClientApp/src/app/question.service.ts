import { Injectable, Inject } from '@angular/core';
import { Question, PostQuestion } from './model/question';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,) { }

  postQuestion(question: PostQuestion): Observable<Question> {
    return this.http.post<Question>(this.baseUrl + "api/Questions", question)
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.baseUrl + "api/Questions")
  }

  getRandomQuestions(size: any): Observable<Question[]> {
    return this.http.get<Question[]>(this.baseUrl + "api/Questions/Random?size=" + size)
  }

  deleteQuestion(id: string): Observable<null> {
    return this.http.delete<null>(this.baseUrl + "api/Questions/" + id)
  }

  putQuestion(question: Question): Observable<null> {
    return this.http.put<null>(this.baseUrl + "api/Questions/" + question.questionId, question)
  }
}
