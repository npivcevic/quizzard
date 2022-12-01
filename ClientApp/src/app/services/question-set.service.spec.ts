import { TestBed } from '@angular/core/testing';

import { QuestionSetService } from './question-set.service';

describe('QuestionSetService', () => {
  let service: QuestionSetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionSetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
