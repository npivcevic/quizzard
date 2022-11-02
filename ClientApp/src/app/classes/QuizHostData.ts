import { Player } from "../classes/Player";
import { Answer } from "../model/answer";
import { Question } from "../model/question";

export class QuizHostData {

    groupName: string = ""
    players: Player[] = []
    questions: Question[] = []
    quizState: QuizState = QuizState.Idle
    private currentQuestionIndex:number = -1;
    currentQuestion!: Question
    currentCorrectAnswer!: Answer | undefined
    copyedToCLipboard:boolean=false

    constructor() {
    }

    reset() {
        this.players.forEach((p) => p.reset())
        this.questions = []
        this.currentQuestionIndex = -1
        this.currentCorrectAnswer = undefined
        this.quizState = QuizState.Idle
    }

    playerConnected(connectionId: string, playerName: string) {
        this.players.push(new Player(connectionId, playerName))
    }

    playerDisconnected(connectionId: string) {
        let player = this.players.find((p) => p.connectionId === connectionId)
        if (player) {
            player.isActive = false;
        }
    }

    playerReconnected(newConnectionId: string, oldConnectionId: string) {
        let player = this.players.find((p) => p.connectionId === oldConnectionId)
        if (player) {
            player.connectionId = newConnectionId
            player.isActive = true;
        }
    }

    recordAnswer(playerConnectionId: string, answerId: string) {
        if (this.quizState !== QuizState.QuestionShowing) {
            return
        }
        const player = this.findPlayerByConnectionId(playerConnectionId)
        if (!player) {
            return
        }
        const isCorrect = answerId === this.currentCorrectAnswer?.id
        player.recordAnswer(answerId, this.currentQuestion.id, isCorrect)
    }

    findPlayerByConnectionId(connectionId: string): Player | undefined
    {
        return this.players.find((p) => p.connectionId === connectionId)
    }

    isLastQuestion() {
        return this.currentQuestionIndex + 1 >= this.questions.length
    }

    nextQuestion() {
        this.currentQuestionIndex++
        this.currentQuestion = this.createCurrentQuestion()
        this.currentCorrectAnswer = this.getCorrectAnswerToCurrentQuestion()
        this.quizState = QuizState.QuestionShowing
    }

    createCurrentQuestion() {
        let qCopy = Object.assign({}, this.questions[this.currentQuestionIndex])
        qCopy.answers = this.questions[this.currentQuestionIndex].answers.map((answer) => answer)
        qCopy.answers =  qCopy.answers.sort((a,b)=>0.5 -Math.random())
        return qCopy
    }

    currentQuestionWithoutIsCorrect() {
        let qCopy = Object.assign({}, this.currentQuestion)
        qCopy.answers = this.currentQuestion.answers.map((answer) => {
            return {
                id: answer.id,
                text: answer.text
            }
        })
        return qCopy
    }

    checkAnswersAndAssignPoints() {
        this.players.forEach((player) => player.assignPoints(this.currentQuestion.id))
        this.players.sort(function (a, b) { return b.score - a.score })
    }

    getCorrectAnswerToCurrentQuestion() {
        return this.questions[this.currentQuestionIndex].answers.find((a) => a.isCorrect === true)
    }
}

export enum QuizState {
    Idle,
    QuestionShowing,
    AnswersShowing,
}