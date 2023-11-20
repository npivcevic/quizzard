import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  isUserLoggedIn: boolean = false;

  public userRole = ""

  login(userCredentials: any): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('username', userCredentials.username);
    formData.append('password', userCredentials.password);
    return this.http.post<any>(this.baseUrl + "api/Auth/login", formData)
  }

  logout(username: string): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('username', username);
    return this.http.post<any>(this.baseUrl + "api/Auth/logout", formData)
  }

  generateRefreshToken(): Observable<any> {
    return this.http.post<any>(this.baseUrl + "api/Auth/refresh-token", null, {withCredentials: true})
  }

  deleteRefreshToken(): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('UserName', localStorage.getItem("username")!);
    return this.http.post<any>(this.baseUrl + "api/Auth/remove-token", formData)
  }

  getUserRole(username: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + `api/Auth/get-user-role?username=${username}`)
  }
}
