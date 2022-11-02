import { PlayerScore } from "../model/player-score";
import { Question } from "../model/question";

export class QuizPlayerData {

    groupName: string = ""
    playerName: string = ""
    quizState: QuizPlayerState = QuizPlayerState.Loading
    currentQuestion!: Question
    currentAnswerId: string = ""
    currentCorrectAnswerId: string = ""
    playerScore:PlayerScore[]=[]
    reconnectPossible: Boolean = false;
    oldClientConnected: Boolean = false;
    reconnected: Boolean = false;

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
    Loading,
    Disconnected,
    WaitingForStart,
    QuestionShowing,
    AnswersShowing,
    End
}