import { SubmitedAnswer } from "./submitedAnswer"

export interface Player {
    connectionId: string,
    name: string
    score:number
    submitedAnswers:SubmitedAnswer[]
}
