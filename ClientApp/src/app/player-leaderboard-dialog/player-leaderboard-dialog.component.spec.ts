import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLeaderboardDialogComponent } from './player-leaderboard-dialog.component';

describe('PlayerLeaderboardDialogComponent', () => {
  let component: PlayerLeaderboardDialogComponent;
  let fixture: ComponentFixture<PlayerLeaderboardDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerLeaderboardDialogComponent]
    });
    fixture = TestBed.createComponent(PlayerLeaderboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
