import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  //indicator for: igra pocinje za ?
  @Input() quizCountDownStarted:boolean=false
  @Input() quizStartsFor:number = 0
  //indicator for: vrijeme za odgovor ?
  @Input() quizStarted:boolean=false
  @Input() totalTimePerQuestion:number =0
  @Input() timeLeft:number=100
  //indicator for: novo pitanje za ?
  @Input() waitingForNewQuestion:boolean=false
  @Input() nextQuestionFor:number = 0
  //indicator for: kviz je gotov ?
  @Input() quizEnded:boolean=false

  public timePeriod:number=0
  public x: number = Math.ceil(this.totalTimePerQuestion / this.timeLeft)


  constructor() { }

  ngOnInit(): void {
    
    this.spinnerControl(this.timePeriod)    

  }

  public spinnerControl(timePeriod:number){

    let ref = setInterval(()=>{
      this.timeLeft -= 0.5
      this.x = Math.ceil(this.totalTimePerQuestion*this.timeLeft/100000)
      if(this.timeLeft <= 0){
        clearInterval(ref)
      }
    }, this.totalTimePerQuestion/(100*2))
  }


  public color:string="blue"
  public mode="determinate"
  public value = "value"

  
    
}
