import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHostAwardComponent } from './quiz-host-award.component';

describe('QuizHostAwardComponent', () => {
  let component: QuizHostAwardComponent;
  let fixture: ComponentFixture<QuizHostAwardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizHostAwardComponent]
    });
    fixture = TestBed.createComponent(QuizHostAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
