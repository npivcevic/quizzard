export interface Question{
    text : string,
    answers: [
        {"text": string,"isCorrect": boolean},
        {"text": string,"isCorrect": boolean},
        {"text": string,"isCorrect": boolean},
        {"text": string,"isCorrect": boolean}
    ]
}