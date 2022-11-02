import { PlayerScore } from "../model/player-score";
import { Question } from "../model/question";

export class QuizPlayerData {

    groupName: string = ""
    playerName: string = ""
    quizState: QuizPlayerState = QuizPlayerState.Disconnected
    currentQuestion!: Question
    currentAnswerId: string = ""
    currentCorrectAnswerId: string = ""
    playerScore:PlayerScore[]=[]

    constructor() {
    }

    questionReceived(question: Question) {
        if (this.quizState === QuizPlayerState.End) {
            this.playerScore = []
        }
        this.currentAnswerId = ""
        this.currentCorrectAnswerId = ""
        this.currentQuestion = question
        this.quizState = QuizPlayerState.QuestionShowing
    }
}

export enum QuizPlayerState {
    Disconnected,
    WaitingForStart,
    QuestionShowing,
    AnswersShowing,
    End
}