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

  openedFromPlayer:boolean = true
  answers : any[] = []
  playerName:string = ""
  

  ngOnInit(): void {
    console.log(this.data)
    if(!this.data.playerName){
      this.answers = this.data
      return 
    }
    this.openedFromPlayer = false
    this.playerName = this.data.playerName
    this.answers = this.data.score
    console.log("this is passed",this.data)
  }

  returnPlayerName(){
      return `Odgovori od : ${this.playerName}`
  }

}
