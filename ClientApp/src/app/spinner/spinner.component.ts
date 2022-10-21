import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  //indicator for: igra pocinje za ?
  @Input() quizStartsFor:number = 0
  //indicator for: novo pitanje za ?
  @Input() newQuestionFor:number = 0

  public quizStarted:boolean=false
  public quizEnded:boolean=false


  constructor() { }

  ngOnInit(): void {
  }


  public color:string="blue"
  public mode="determinate"
  public value = "value"
    
}
