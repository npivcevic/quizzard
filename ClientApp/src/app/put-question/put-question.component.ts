import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-put-question',
  templateUrl: './put-question.component.html',
  styleUrls: ['./put-question.component.css']
})
export class PutQuestionComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:{text:string,answer1:string,answer2:string,answer3:string,answer4:string}) { }
  
  ngOnInit(): void {
    
  }
 
}
