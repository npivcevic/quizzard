import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHostFinishDisplayComponent } from './quiz-host-finish-display.component';

describe('QuizHostFinishDisplayComponent', () => {
  let component: QuizHostFinishDisplayComponent;
  let fixture: ComponentFixture<QuizHostFinishDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizHostFinishDisplayComponent]
    });
    fixture = TestBed.createComponent(QuizHostFinishDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
