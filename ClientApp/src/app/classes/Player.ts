import { Question } from "../model/question"
import { QuestionSet } from "../model/question-set"
import { SubmitedAnswer } from "../model/submitedAnswer"

export class Player {
    connectionId: string = ""
    name: string = ""
    score: number = 0
    submitedAnswers: SubmitedAnswer[] = []
    isActive: Boolean = true

    constructor(connectionId: string, name: string) {
        this.connectionId = connectionId
        this.name = name
    }

    recordAnswer(answerId: string, questionId: string, isCorrect: boolean) {
        if (answerId === "") {
            return
        }
        const alreadyAnswered = this.submitedAnswers.some((submittedAnswer) => submittedAnswer.questionId === questionId)
        if (alreadyAnswered) {
            console.log("Player already submitted an answer for the current question. Skipping.")
            return
        }

        this.submitedAnswers.push({
            answerId,
            questionId,
            isCorrect
        })
    }

    assignPoints(currentQuestionId: string): void {
        let answerToCurrentQuesiton = this.getSubmittedAnswer(currentQuestionId)
        if (!answerToCurrentQuesiton) {
            return
        }
        if (answerToCurrentQuesiton.isCorrect) {
            this.score++;
        }
    }

    reset() {
        this.score = 0
        this.submitedAnswers = []
    }

    getSubmittedAnswer(questionId: string) {
        return this.submitedAnswers.find((sa) => sa.questionId === questionId)
    }

    hasAnswered(questionId: string) {
        return this.submitedAnswers.some(sa => sa.questionId === questionId)
    }

    hasAnsweredCorrectly(questionId: string) {
        return this.submitedAnswers.some(sa => sa.questionId === questionId && sa.isCorrect)
    }

    getQuizReviewBoardForOneQuestionSet(questions: Question[]) {
        return questions.map(q => {
            const submitedAnswer = this.getSubmittedAnswer(q.questionId)
            const answer = q.answers.find(a => a.answerId === submitedAnswer?.answerId)
            const correctAnswer = q.answers.find(a => a.isCorrect === true)

            return {
                questionText: q.text,
                answerText: answer?.text,
                isCorrect: answer?.isCorrect || false,
                correctAnswer: correctAnswer?.text
            }
        })
    }

    getQuizReviewBoard(questionSets: QuestionSet[]) {
        return questionSets.map(q => {
            return {
                questionSetName: q.name,
                score : this.getQuizReviewBoardForOneQuestionSet(q.questions),
            }
        })
    }
}
