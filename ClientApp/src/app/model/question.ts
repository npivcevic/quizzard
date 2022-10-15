import { Answer, PostAnswer } from "./answer"

export interface Question {
    id: string,
    text: string,
    answers: Answer[]
}

export interface PostQuestion extends Omit<Question, 'id'> { 
    answers: PostAnswer[]
}


