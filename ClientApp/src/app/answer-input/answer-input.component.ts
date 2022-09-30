import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Answer } from '../model/answer';

@Component({
  selector: 'app-answer-input',
  templateUrl: './answer-input.component.html',
  styleUrls: ['./answer-input.component.css']
})
export class AnswerInputComponent implements OnInit {

  @Input() answer!: Answer;
  @Input() i!: number;
  @Output() sendAmswers = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  sendAsnwersEvent(value:string){
    this.sendAmswers.emit(value)
  }
}
