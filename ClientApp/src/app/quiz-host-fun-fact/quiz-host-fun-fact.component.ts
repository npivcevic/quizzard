import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-quiz-host-fun-fact',
  templateUrl: './quiz-host-fun-fact.component.html',
  styleUrls: ['./quiz-host-fun-fact.component.css']
})
export class QuizHostFunFactComponent {
  @Input() text?: string = '';

}
