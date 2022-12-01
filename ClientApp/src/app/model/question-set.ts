import { Question } from "./question";

export interface QuestionSet {
    questionSetId:string,
    name:string,
    order:number,
    questions:Question[],
    quizId:string,
    quiz:string
}