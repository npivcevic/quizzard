import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz-host-award',
  templateUrl: './quiz-host-award.component.html',
  styleUrls: ['./quiz-host-award.component.css']
})
export class QuizHostAwardComponent implements OnInit {
  @Input() position: number = 1;
  @Input() playerName: string = ''
  @Input() additionalText: string = ''
  small: boolean = false;
  medal: string = "🥇"
  positionText: string = "Prvo mjesto"

  ngOnInit() {
    this.medal = this.position === 1
      ? "🥇"
      : this.position === 2 ? "🥈" : "🥉"

    this.positionText = this.position === 1
      ? "Prvo mjesto"
      : this.position === 2 ? "Drugo mjesto" : "Treće mjesto"

    this.small = this.position !== 1
  }
}
