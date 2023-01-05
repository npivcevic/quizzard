import { Answer, PostAnswer } from "./answer"

export interface Question {
    questionId: string,
    text: string,
    order : number,
    answers: Answer[]
    questionSetId:string
}

export interface PostQuestion extends Omit<Question, 'questionId'> { 
    answers: PostAnswer[]
}
