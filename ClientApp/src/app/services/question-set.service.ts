import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostQuestionSet, QuestionSet } from '../model/question-set';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionSetService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getQuestionSets(): Observable<QuestionSet[]> {
    return this.http.get<QuestionSet[]>(environment.apiUrl + "api/QuestionSets")
  }

  getQuestionSet(quiestionSetId:string): Observable<QuestionSet> {
    return this.http.get<QuestionSet>(environment.apiUrl + "api/QuestionSets/"+quiestionSetId)
  }

  deleteQuestionSet(id: string): Observable<null> {
    return this.http.delete<null>(environment.apiUrl + "api/QuestionSets/" + id)
  }

  postQuestionSet(questionSet: PostQuestionSet): Observable<PostQuestionSet> {
    return this.http.post<QuestionSet>(environment.apiUrl + "api/QuestionSets", questionSet)
  }

  putQuestionSet(questionSet: QuestionSet): Observable<null> {
    return this.http.put<null>(environment.apiUrl + "api/QuestionSets/"+questionSet.questionSetId, questionSet)
  }
}
