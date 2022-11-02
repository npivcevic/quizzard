export interface Answer {
    id?: string,
    text: string,
    isCorrect?: boolean
}


export interface PostAnswer extends Omit<Answer,'id'>{}
