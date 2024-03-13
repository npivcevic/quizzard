import { Injectable, Inject } from '@angular/core';
import { Question, PostQuestion } from './model/question';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  postQuestion(question: PostQuestion): Observable<Question> {
    return this.http.post<Question>(environment.apiUrl + "api/Questions", question)
  }

  postQuestionBulk(question: PostQuestion[]): Observable<null> {
    return this.http.post<null>(environment.apiUrl + "api/Questions/Bulk", question)
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(environment.apiUrl + "api/Questions")
  }

  getRandomQuestions(size: any): Observable<Question[]> {
    return this.http.get<Question[]>(environment.apiUrl + "api/Questions/Random?size=" + size)
  }

  deleteQuestion(id: string): Observable<null> {
    return this.http.delete<null>(environment.apiUrl + "api/Questions/" + id)
  }

  putQuestion(question: Question): Observable<null> {
    return this.http.put<null>(environment.apiUrl + "api/Questions/" + question.questionId, question)
  }
}
