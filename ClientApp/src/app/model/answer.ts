export interface Answer {
    answerId?: string,
    text: string,
    isCorrect?: boolean
}


export interface PostAnswer extends Omit<Answer,'id'>{}
