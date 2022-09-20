import { Answer } from './answer.model';

export interface Question {
    id: string;
    text: string;
    answers: Answer[];
  }