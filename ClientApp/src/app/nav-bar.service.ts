import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  visible: boolean=true;
  isExpanded: boolean=false;

  hide() { this.visible = false; }

  show() { this.visible = true; }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  collapse() {
    this.isExpanded = false;
  }

}
