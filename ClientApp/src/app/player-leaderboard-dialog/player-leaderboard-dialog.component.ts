import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SimpleDialogComponent } from '../simple-dialog/simple-dialog.component';
import { ScoreboardRow } from '../model/scoreboard-row';

@Component({
  selector: 'app-player-leaderboard-dialog',
  templateUrl: './player-leaderboard-dialog.component.html',
  styleUrls: ['./player-leaderboard-dialog.component.css']
})
export class PlayerLeaderboardDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {leaderboard: ScoreboardRow[]}, private dialogRef: MatDialogRef<SimpleDialogComponent>) { }

}
