import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlayerScore } from '../model/player-score';
@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:any) { }

  //inputs
  answers : PlayerScore[] = []
  

  ngOnInit(): void {
    this.answers = this.data
    console.log(this.answers)
  }

}
