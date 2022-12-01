import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCreatorComponent } from './quiz-creator.component';

describe('QuizCreatorComponent', () => {
  let component: QuizCreatorComponent;
  let fixture: ComponentFixture<QuizCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
