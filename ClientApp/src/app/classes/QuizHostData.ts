import { BehaviorSubject, Subject } from "rxjs";
import { Player } from "../classes/Player";
import { Answer } from "../model/answer";
import { Question } from "../model/question";
import { ScoreboardRow } from "../model/scoreboard-row";
import { QuestionSet } from "../model/question-set";
import { Quiz } from "../model/quiz";

export class QuizHostData {

    groupName: string = ""
    players: Player[] = []
    quiz!: Quiz
    questionSets: QuestionSet[] = []
    currentQuestionSet!: QuestionSet
    currentQuestionSetIndex: number = 0
    questions: Question[] = []
    quizState: BehaviorSubject<QuizState> = new BehaviorSubject<QuizState>(QuizState.Idle)
    currentQuestionIndex: number = -1;
    currentQuestion!: Question
    currentCorrectAnswer!: Answer | undefined
    copyedToCLipboard: boolean = false

    constructor() {
    }

    reset() {
        this.players.forEach((p) => p.reset())
        this.questions = []
        this.currentQuestionIndex = -1
        this.currentCorrectAnswer = undefined
        this.currentQuestionSetIndex =  0
        this.quizState.next(QuizState.Idle)
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
        if (this.quizState.getValue() !== QuizState.QuestionShowing) {
            return
        }
        const player = this.findPlayerByConnectionId(playerConnectionId)
        if (!player) {
            return
        }
        const isCorrect = answerId === this.currentCorrectAnswer?.answerId
        player.recordAnswer(answerId, this.currentQuestion.questionId, isCorrect)
    }

    findPlayerByConnectionId(connectionId: string): Player | undefined {
        return this.players.find((p) => p.connectionId === connectionId)
    }

    isLastQuestion() {
        return this.currentQuestionIndex + 1 >= this.questions.length
    }

    isLastQuestionSet() {
        return this.currentQuestionSetIndex + 1 >= this.quiz.questionSets.length
    }

    nextQuestion() {
        this.currentQuestionIndex++
        this.currentQuestion = this.createCurrentQuestion()
        this.currentCorrectAnswer = this.getCorrectAnswerToCurrentQuestion()
        this.quizState.next(QuizState.QuestionShowing)
    }

    nextQuestionSet(){
        this.currentQuestionSetIndex++
        this.currentQuestionIndex = -1
        this.currentQuestionSet = this.quiz.questionSets[this.currentQuestionSetIndex]
        this.questions = this.quiz.questionSets[this.currentQuestionSetIndex].questions
        this.quizState.next(QuizState.SetDelayShowing)
    }

    createCurrentQuestion() {
        let qCopy = Object.assign({}, this.questions[this.currentQuestionIndex])
        qCopy.answers = this.questions[this.currentQuestionIndex].answers.map((answer) => answer)
        qCopy.answers = qCopy.answers.sort((a, b) => 0.5 - Math.random())
        return qCopy
    }

    currentQuestionWithoutIsCorrect() {
        let qCopy = Object.assign({}, this.currentQuestion)
        qCopy.answers = this.currentQuestion.answers.map((answer) => {
            return {
                answerId: answer.answerId,
                text: answer.text
            }
        })
        return qCopy
    }

    checkAnswersAndAssignPoints() {
        this.players.forEach((player) => player.assignPoints(this.currentQuestion.questionId))
        this.players.sort(function (a, b) { return b.score - a.score })
    }

    public checkIfAllPlayerAnsweredCurrentQuestion() {
        for (let i = 0; i < this.players.length; i++) {
            if (!this.players[i].hasAnswered(this.currentQuestion.questionId)) {
                return false
            }
        }
        return true
    }

    public playersScoreboard() {
        return this.players.map(player =>{
            return{
                playerName:player.name,
                points: player.score
            }
        })
    }

    getCorrectAnswerToCurrentQuestion() {
        return this.questions[this.currentQuestionIndex].answers.find((a) => a.isCorrect === true)
    }

    getPlayerNameByConnectionId(connectionId:string){
        return this.players.find(p =>p.connectionId === connectionId)
    }
}

export enum QuizState {
    Idle,
    QuizPreview,
    QuestionShowing,
    AnswersShowing,
    SetDelayShowing
}
