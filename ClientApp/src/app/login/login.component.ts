import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = this.fb.group({
    username: this.fb.nonNullable.control('', [Validators.required]),
    password: this.fb.nonNullable.control('', [Validators.required])
  })
  constructor(
    public fb: FormBuilder,
    private _router: Router,
    private authService: AuthService) { }

  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem("token", res.token)
        localStorage.setItem("username", this.loginForm.value.username!)
        this.authService.isUserLoggedIn = true;
        this.authService.userRole = res.role;

        if (res.role == "Host") {
          this._router.navigate(['quizzes']);
        }
      },
      error: (err) => {
      }
    });
  }
}
