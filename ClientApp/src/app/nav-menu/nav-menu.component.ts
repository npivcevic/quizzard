import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  hideNavRef:boolean=false

  @Output() sendHideNav = new EventEmitter<boolean>();

  hideNavFunction(status:boolean){
    this.navBarVisibility(status)
    if(this.hideNavRef){
      this.sendHideNav.emit(true)
      return
    }
    this.sendHideNav.emit(false)
    console.log(this.hideNavRef)
  }

  navBarVisibility(status:boolean){
    this.hideNavRef=status
  }


  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
