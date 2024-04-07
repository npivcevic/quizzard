import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(public authService: AuthService, private router: Router, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.document.documentElement.lang = 'hr'; 
    this.authService.handleRefresh()


    // const username = localStorage.getItem("username");
    // this.authService.isUserLoggedIn = username != null ?? false
    // if (this.authService.isUserLoggedIn) {
    //   this.authService.getUserRole(username!).subscribe({
    //     next: (res) => {
    //       if (res.role === "Player") {
    //         this.router.navigate(['quiz-player']);
    //       }
    //       if (res.role === "Host") {
    //         this.router.navigate(['quiz-host']);
    //       }
    //     }
    //   })
    // }
  }
}
