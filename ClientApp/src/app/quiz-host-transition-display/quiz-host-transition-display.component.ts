import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-quiz-host-transition-display',
  templateUrl: './quiz-host-transition-display.component.html',
  styleUrls: ['./quiz-host-transition-display.component.css']
})
export class QuizHostTransitionDisplayComponent {

  @Input() title: string = ""
  @Input() description1: string = ""
  @Input() description2: string = ""
  @Input() spinnerTimeout: number = 0
  @Input() spinnerText: string = ""

  @Output() timeout = new EventEmitter<string>();

}
