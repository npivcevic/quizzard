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
  @Input() isLarge: boolean = false
  @Output() timeout = new EventEmitter<string>();
  @Input() type: string = "spinner"

  public color: string = "blue"
  public mode = "determinate"
  public value = "value"

  public timeLeft: number = this.time;
  public percentageLeft: number = 100
  public timeLeftString: string = "0"
  constructor() { }

  ngOnInit(): void {
    // this.spinnerControl()    
  }

  public spinnerControl() {
    clearInterval(this.intervalRef)
    this.percentageLeft = 100
    this.timeLeft = this.time
    this.timeLeftString = this.secondsToMinutesAndSeconds(this.timeLeft)
    this.intervalRef = setInterval(() => {
      this.timeLeft -= 200
      this.percentageLeft = (this.timeLeft / this.time) * 100
      this.timeLeftString = this.secondsToMinutesAndSeconds(this.timeLeft)
      if (this.timeLeft <= 0) {
        clearInterval(this.intervalRef)
        this.timeout.emit();
      }
    }, 200)
  }

  ngOnChanges() {
    this.spinnerControl();
  }

  secondsToMinutesAndSeconds(timeInMiliseconds: number): string {
    const timeInSeconds = Math.ceil(timeInMiliseconds/1000)
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.ceil(timeInSeconds % 60)
    if (minutes === 0) {
      return seconds.toString();
    }
    if (seconds<10) {
      return `${minutes.toString()}:0${seconds.toString()}`
    }
    return `${minutes.toString()}:${seconds.toString()}`
  }
}
