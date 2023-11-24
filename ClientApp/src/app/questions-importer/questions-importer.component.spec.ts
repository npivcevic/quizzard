import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsImporterComponent } from './questions-importer.component';

describe('QuestionsImporterComponent', () => {
  let component: QuestionsImporterComponent;
  let fixture: ComponentFixture<QuestionsImporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsImporterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
