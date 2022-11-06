export class QuizSettings {
    numberOfQuestions: number = 2
    totalTimePerQuestion: number = 10000
    nextQuestionDelay: number = 4000
    MoveToNextQuestionWhenAllPlayersAnswered : boolean = true
    autoStartNewQuiz:boolean = false
    autoStartNewQuizDelay : number = 60000
}
