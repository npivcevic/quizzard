import { Answer } from "./answer"

export interface Questions {
    id: string,
    text: string,
    answers: Answer[]
}
