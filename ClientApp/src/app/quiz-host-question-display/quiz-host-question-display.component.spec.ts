import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHostQuestionDisplayComponent } from './quiz-host-question-display.component';

describe('QuizHostQuestionDisplayComponent', () => {
  let component: QuizHostQuestionDisplayComponent;
  let fixture: ComponentFixture<QuizHostQuestionDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizHostQuestionDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizHostQuestionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
