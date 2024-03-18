import { PlayerScore } from "../model/player-score";
import { Question } from "../model/question";
import { ScoreboardRow } from "../model/scoreboard-row";

export class QuizPlayerData {

    groupName: string = ""
    playerName: string = ""
    quizState: QuizPlayerState = QuizPlayerState.Loading
    currentQuestion!: Question
    currentAnswerId: string = ""
    currentAnswerText: string = ""
    currentCorrectAnswerId: string = ""
    playerScore:PlayerScore[]=[]
    displayedColumns: string[] = ['playerName', 'points'];
    scoreBoard:ScoreboardRow[]=[]
    dataSource = this.scoreBoard
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
        this.currentAnswerText = ""
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
    End,
    SetDelayShowing,
}