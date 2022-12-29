import { QuestionSet } from "./question-set";

export interface Quiz {
    quizId:string,
    name:string,
    description:string,
    status:number,
    publishDate:Date | null,
    numberOfQuestions:number,
    questionSets : QuestionSet[]
}

export interface PutQuiz extends Omit<Quiz, 'questionSets' | 'numberOfQuestions'> { 
}


export interface PostQuiz extends Omit<Quiz, 'quizId' | 'questionSets' | 'numberOfQuestions'> { 
}

