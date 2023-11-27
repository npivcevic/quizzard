import { Component} from '@angular/core';
import { NavBarService } from '../nav-bar.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  constructor(public navbarservice: NavBarService, public authService: AuthService) { }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.authService.logout(localStorage.getItem("username")!).subscribe(() => {
      localStorage.clear();
      this.authService.isUserLoggedIn = false;
    });
  }
}
