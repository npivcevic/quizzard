import { QuestionSet } from "./question-set";

export interface Quiz {
    quizId:string,
    name:string,
    description:string,
    numberOfQuestions:number,
    questionSets : QuestionSet[]
}

export interface PutQuiz extends Omit<Quiz, 'questionSets' | 'numberOfQuestions'> { 
}