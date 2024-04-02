const quizSettingsLocalStorageKey = 'quizSettings'

export class QuizSettings {
    totalTimePerQuestion: number = 30000
    nextQuestionDelay: number = 10000
    nextSetDelay: number = 60000
    MoveToNextQuestionWhenAllPlayersAnswered : boolean = true
    quizStartDelay: number = 5000

    loadFromLocalStorage() {
        let loadedSettings = localStorage.getItem(quizSettingsLocalStorageKey);
        if (!loadedSettings) {
            return
        }
        let loaded : QuizSettings = JSON.parse(loadedSettings)
        if (!loadedSettings) {
            return
        }

        this.totalTimePerQuestion = loaded.totalTimePerQuestion ?? this.totalTimePerQuestion
        this.nextQuestionDelay = loaded.nextQuestionDelay ?? this.nextQuestionDelay
        this.nextSetDelay = loaded.nextSetDelay ?? this.nextSetDelay
        this.MoveToNextQuestionWhenAllPlayersAnswered = loaded.MoveToNextQuestionWhenAllPlayersAnswered ?? this.MoveToNextQuestionWhenAllPlayersAnswered
        this.quizStartDelay = loaded.quizStartDelay ?? this.quizStartDelay
    }

    saveToLocalStorage() {
        console.log('stringify', JSON.stringify(this))
        localStorage.setItem(quizSettingsLocalStorageKey, JSON.stringify(this))
    }
}
