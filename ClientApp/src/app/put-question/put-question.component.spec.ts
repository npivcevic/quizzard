import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutQuestionComponent } from './put-question.component';

describe('PutQuestionComponent', () => {
  let component: PutQuestionComponent;
  let fixture: ComponentFixture<PutQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PutQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PutQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
