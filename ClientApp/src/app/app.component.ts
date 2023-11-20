import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const username = localStorage.getItem("username");
    this.authService.isUserLoggedIn = username != null ?? false
    if (this.authService.isUserLoggedIn) {
      this.authService.getUserRole(username!).subscribe({
        next: (res) => {
          console.log(res.role)
          if (res.role === "Player") {
            this.router.navigate(['quiz-player']);
          }
          if (res.role === "Host") {
            this.router.navigate(['quiz-host']);
          }
        }
      })
    }

  }



}
