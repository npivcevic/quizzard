import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isUserLoggedIn: boolean = false;

  public userRole = ""

  login(userCredentials: any): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('username', userCredentials.username);
    formData.append('password', userCredentials.password);
    return this.http.post<any>(environment.apiUrl + "api/Auth/login", formData)
  }

  logout(username: string): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('username', username);
    return this.http.post<any>(environment.apiUrl + "api/Auth/logout", formData)
  }

  generateRefreshToken(): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "api/Auth/refresh-token", null, {withCredentials: true})
  }

  deleteRefreshToken(): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('UserName', localStorage.getItem("username")!);
    return this.http.post<any>(environment.apiUrl + "api/Auth/remove-token", formData)
  }

  getUserRole(username: string): Observable<any> {
    return this.http.get<any>(environment.apiUrl + `api/Auth/get-user-role?username=${username}`)
  }

  handleRefresh(){
    const username = localStorage.getItem("username");
    if(username === null || username === undefined){
      return
    }
    this.getUserRole(username!).subscribe({
      next: (res) => {
        this.isUserLoggedIn = true;
        this.userRole = res.role
      },
      error: () => {
      }
    })
  }
}
