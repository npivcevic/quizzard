export interface PlayerScore{
    questionText:string,
    answerText:string,
    isCorrect:boolean
    correctAnswer:string
}

export interface QuestionSetPlayerScore{
    questionSetName:string,
    score: PlayerScore[]
}
