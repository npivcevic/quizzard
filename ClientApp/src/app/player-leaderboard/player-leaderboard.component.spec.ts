import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLeaderboardComponent } from './player-leaderboard.component';

describe('PlayerLeaderboardComponent', () => {
  let component: PlayerLeaderboardComponent;
  let fixture: ComponentFixture<PlayerLeaderboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerLeaderboardComponent]
    });
    fixture = TestBed.createComponent(PlayerLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
