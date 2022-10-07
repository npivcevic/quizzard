import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-host-page',
  templateUrl: './host-page.component.html',
  styleUrls: ['./host-page.component.css']
})
export class HostPageComponent implements OnInit {

  public noCode=true
  public code =""

  constructor() { }

  ngOnInit(): void {
  }

  hostForm = new FormGroup({
    hostCode:new  FormControl("", [Validators.minLength(6)])
  })

  get codeValue(){
    return this.hostForm.get("hostCode")
  }

  host(){
    console.log(this.hostForm.value)
  }

  generateCode(lenght:number){
    // generating code for hosting
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result ="";
    for(let i = 0; i<lenght;i++){
      result += chars.charAt(Math.floor(Math.random() * chars.length));    
    }
    this.code=result
    this.noCode=false
  }
}
