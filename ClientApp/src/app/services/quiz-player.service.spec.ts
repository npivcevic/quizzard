import { TestBed } from '@angular/core/testing';

import { QuizPlayerService } from './quiz-player.service';

describe('QuizPlayerService', () => {
  let service: QuizPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
