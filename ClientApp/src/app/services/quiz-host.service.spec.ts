import { TestBed } from '@angular/core/testing';

import { QuizHostService } from './quiz-host.service';

describe('QuizHostService', () => {
  let service: QuizHostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizHostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
