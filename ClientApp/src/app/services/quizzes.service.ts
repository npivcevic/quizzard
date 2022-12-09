import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PutQuiz, Quiz } from '../model/quiz';
@Injectable({
  providedIn: 'root'
})
export class QuizzesService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.baseUrl + "api/Quizzes")
  }

  getQuiz(quizId:string): Observable<Quiz> {
    return this.http.get<Quiz>(this.baseUrl + "api/Quizzes/"+quizId)
  }

  deleteQuiz(id: string): Observable<null> {
    return this.http.delete<null>(this.baseUrl + "api/Quizzes/" + id)
  }

  postQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(this.baseUrl + "api/Quizzes", quiz)
  }

  putQuiz(quiz: PutQuiz): Observable<null> {
    return this.http.put<null>(this.baseUrl + "api/Quizzes/" + quiz.quizId, quiz)
  }
}
