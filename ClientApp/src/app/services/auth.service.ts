import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  login(userCredentials:any): Observable<any> {
    return this.http.post<any>(this.baseUrl + "api/Auth/login", userCredentials)
  }

  generateRefreshToken(): Observable<any> {
    return this.http.post<any>(this.baseUrl + "api/Auth/refresh-token", null, {withCredentials: true})
  }

  deleteRefreshToken(): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('UserName', localStorage.getItem("username")!);
    return this.http.post<any>(this.baseUrl + "api/Auth/remove-token", formData)
  }

  auth(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "api/Auth")
  }
}
