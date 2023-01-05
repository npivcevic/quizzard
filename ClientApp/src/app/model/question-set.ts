import { Question } from "./question";

export interface QuestionSet {
    questionSetId:string,
    name:string,
    order:number,
    questions:Question[],
    quizId:string,
    quiz:string
}

export interface PostQuestionSet extends Omit<QuestionSet, 'questionSetId' | "quiz"> { 
 
}
