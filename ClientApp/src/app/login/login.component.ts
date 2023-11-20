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
    email: this.fb.nonNullable.control('', [Validators.required]),
    password: this.fb.nonNullable.control('', [Validators.required])
  })
  constructor(
    public fb: FormBuilder,
    private _router: Router,
    private loginService: AuthService) { }

  login() {
    this.loginService.login(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem("token", res.token)
        localStorage.setItem("username", this.loginForm.value.email!)

        this._router.navigate(['']);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
