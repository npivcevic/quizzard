import { PlayerScore, QuestionSetPlayerScore } from "../model/player-score";
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
    currentQuestionNumber: number = 0
    totalNumberOfQuestionsInSet: number = 0
    currentSetNumber: number = 0
    totalNumberOfSets: number = 0

    scoreBoard:ScoreboardRow[]=[]
    currentScore: number = 0
    currentPosition: number = 0

    playerScore:QuestionSetPlayerScore[]=[]
    displayedColumns: string[] = ['playerName', 'points'];
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

    setScoreBoard(scoreBoard: ScoreboardRow[], playerConnectionId: string) {
        this.scoreBoard = scoreBoard
        this.currentPosition = this.getPlayerPosition(playerConnectionId);
        this.currentScore = this.getPlayerScore(playerConnectionId);
    }

    getPlayerScore(playerConnectionId: string) {
        let player = this.scoreBoard.find((p) => p.playerId === playerConnectionId)
        if (!player) {
            return 0
        }
        return player.points;
    }

    getPlayerPosition(playerConnectionId: string) {
        let playerIndex = this.scoreBoard.findIndex((p) => p.playerId === playerConnectionId)
        if (playerIndex === -1) {
            return 0
        }
        return playerIndex+1;
    }

    getTotalNumberOfQuestions() {
        return this.playerScore.reduce((result, set) => {
            return result + set.score.length
        },0)
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