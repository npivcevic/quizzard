import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionSetComponent } from './add-question-set.component';

describe('AddQuestionSetComponent', () => {
  let component: AddQuestionSetComponent;
  let fixture: ComponentFixture<AddQuestionSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQuestionSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuestionSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
