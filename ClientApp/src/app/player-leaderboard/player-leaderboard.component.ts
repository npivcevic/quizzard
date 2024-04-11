import { Component, Input } from '@angular/core';
import { ScoreboardRow } from '../model/scoreboard-row';

@Component({
  selector: 'app-player-leaderboard',
  templateUrl: './player-leaderboard.component.html',
  styleUrls: ['./player-leaderboard.component.css']
})
export class PlayerLeaderboardComponent {
  @Input() leaderboard :ScoreboardRow[]=[];
  displayedColumns: string[] = ['index', 'playerName', 'points'];
  
}
