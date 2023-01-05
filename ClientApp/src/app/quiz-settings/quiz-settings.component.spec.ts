import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSettingsComponent } from './quiz-settings.component';

describe('QuizSettingsComponent', () => {
  let component: QuizSettingsComponent;
  let fixture: ComponentFixture<QuizSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
