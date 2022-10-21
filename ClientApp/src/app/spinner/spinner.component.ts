import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnChanges {
  @Input() time: number = 0
  @Input() text: string = ""
  @Output() timeout = new EventEmitter<string>();

  public color:string="blue"
  public mode="determinate"
  public value = "value"

  public timeLeft:number=100
  public timeLeftInSeconds: number = Math.ceil(this.time / this.timeLeft)
  constructor() { }

  ngOnInit(): void {
    // this.spinnerControl()    
  }

  public spinnerControl(){
    this.timeLeft = 100
    let ref = setInterval(()=>{
      this.timeLeft -= 0.5
      this.timeLeftInSeconds = Math.ceil(this.time*this.timeLeft/100000)
      if(this.timeLeft <= 0){
        clearInterval(ref)
        this.timeout.emit();
      }
    }, this.time/(100*2)) 
  }

  ngOnChanges() {
    console.log('changes detected')
    this.spinnerControl();
  }
}
