import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionLibraryComponent } from './question-library.component';

describe('QuestionLibraryComponent', () => {
  let component: QuestionLibraryComponent;
  let fixture: ComponentFixture<QuestionLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
