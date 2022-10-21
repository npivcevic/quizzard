import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  //indicator for: igra pocinje za ?
  @Input() quizCountDownStarted:boolean=false
  @Input() quizStartsFor!:number
  //indicator for: vrijeme za odgovor ?
  @Input() quizStarted!:boolean
  @Input() totalTimePerQuestion!:number
  @Input() timeLeft:number=100
  //indicator for: novo pitanje za ?
  @Input() waitingForNewQuestion:boolean=false
  @Input() nextQuestionFor!:number
  //indicator for: kviz je gotov ?
  @Input() quizEnded:boolean=false

  public timePeriod:number=0
  public x: number = Math.ceil(this.totalTimePerQuestion / this.timeLeft)


  constructor() { }

  ngOnInit(): void {


    
    this.spinnerControl()    

  }

  public spinnerControl(){

    if(this.quizStarted===true && this.waitingForNewQuestion===false){
      this.timePeriod=this.totalTimePerQuestion
    }
    this.timeLeft = 100
    let ref = setInterval(()=>{
      this.timeLeft -= 0.5
      this.x = Math.ceil(this.timePeriod*this.timeLeft/100000)
      if(this.timeLeft <= 0){
        clearInterval(ref)
        setTimeout(() => this.spinnerControl() , this.nextQuestionFor)

      }
    }, this.timePeriod/(100*2)) 
  }


  public color:string="blue"
  public mode="determinate"
  public value = "value"

  
    
}
