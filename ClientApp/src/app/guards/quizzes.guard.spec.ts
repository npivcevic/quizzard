import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { quizzesGuard } from './quizzes.guard';

describe('quizzesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => quizzesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
