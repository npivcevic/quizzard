import { Component, OnInit, Input } from '@angular/core';
import { Answer } from '../model/answer';

@Component({
  selector: 'app-answer-input',
  templateUrl: './answer-input.component.html',
  styleUrls: ['./answer-input.component.css']
})
export class AnswerInputComponent implements OnInit {

  @Input() answer!: Answer;
  @Input() i!: number;
  constructor() { }

  ngOnInit(): void {
  }

}
