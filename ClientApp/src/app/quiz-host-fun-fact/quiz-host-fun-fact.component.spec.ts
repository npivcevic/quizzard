import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHostFunFactComponent } from './quiz-host-fun-fact.component';

describe('QuizHostFunFactComponent', () => {
  let component: QuizHostFunFactComponent;
  let fixture: ComponentFixture<QuizHostFunFactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizHostFunFactComponent]
    });
    fixture = TestBed.createComponent(QuizHostFunFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
