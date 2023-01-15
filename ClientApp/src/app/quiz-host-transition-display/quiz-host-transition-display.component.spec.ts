import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHostTransitionDisplayComponent } from './quiz-host-transition-display.component';

describe('QuizHostTransitionDisplayComponent', () => {
  let component: QuizHostTransitionDisplayComponent;
  let fixture: ComponentFixture<QuizHostTransitionDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizHostTransitionDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizHostTransitionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
