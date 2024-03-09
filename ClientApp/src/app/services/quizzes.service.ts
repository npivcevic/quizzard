import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostQuiz, PutQuiz, Quiz } from '../model/quiz';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizzesService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(environment.apiUrl + "api/Quizzes")
  }

  getPublishedQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(environment.apiUrl + "api/Quizzes/published")
  }

  getQuiz(quizId:string): Observable<Quiz> {
    return this.http.get<Quiz>(environment.apiUrl + "api/Quizzes/"+quizId)
  }

  deleteQuiz(id: string): Observable<null> {
    return this.http.delete<null>(environment.apiUrl + "api/Quizzes/" + id)
  }

  postQuiz(quiz: PostQuiz): Observable<Quiz> {
    return this.http.post<Quiz>(environment.apiUrl + "api/Quizzes", quiz)
  }

  putQuiz(quiz: PutQuiz): Observable<null> {
    return this.http.put<null>(environment.apiUrl + "api/Quizzes/" + quiz.quizId, quiz)
  }
}
