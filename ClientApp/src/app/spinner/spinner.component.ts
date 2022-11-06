import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnChanges {

  private intervalRef: any

  @Input() time!: number
  @Input() text!: string
  @Output() timeout = new EventEmitter<string>();
  @Input() type: string = "spinner"

  public color: string = "blue"
  public mode = "determinate"
  public value = "value"

  public timeLeft: number = 100
  public timeLeftInSeconds: number = Math.ceil(this.time / this.timeLeft)
  constructor() { }

  ngOnInit(): void {
    // this.spinnerControl()    
  }

  public spinnerControl() {
    clearInterval(this.intervalRef)
    this.timeLeft = 100
    this.intervalRef = setInterval(() => {
      this.timeLeft -= 0.5
      this.timeLeftInSeconds = Math.ceil(this.time * this.timeLeft / 100000)
      if (this.timeLeft <= 0) {
        clearInterval(this.intervalRef)
        this.timeout.emit();
      }
    }, this.time / (100 * 2))
  }

  ngOnChanges() {
    this.spinnerControl();
  }
}
