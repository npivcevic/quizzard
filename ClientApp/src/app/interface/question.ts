export interface Question{
    id?:string,
    text: string
    answers: [{ "text": string,"isCorrect": boolean},
              { "text": string,"isCorrect": boolean},
              { "text": string,"isCorrect": boolean},
              { "text": string,"isCorrect": boolean}]
}