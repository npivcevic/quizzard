import { Component, OnInit } from '@angular/core';
import { QuizPlayerState } from '../classes/QuizPlayerData';
import { QuizPlayerService } from '../services/quiz-player.service';

@Component({
  selector: 'app-quiz-player',
  templateUrl: './quiz-player.component.html',
  styleUrls: ['./quiz-player.component.css']
})
export class QuizPlayerComponent implements OnInit {

  quizGroupNameInput: string = "";
  playerNameInput: string = "";

  constructor(public quizPlayerService: QuizPlayerService) { }

  ngOnInit(): void {
    this.quizPlayerService.initialize();
    this.playerNameInput = localStorage.getItem('playerName') || ""
  }

  public joinQuiz() {
    this.quizPlayerService.joinQuiz(this.quizGroupNameInput, this.playerNameInput)
    localStorage.setItem('playerName', this.playerNameInput)
  }

  public isConnectedToQuiz() {
    return this.quizPlayerService.quizData.quizState != QuizPlayerState.Disconnected
  }

  public isWaitingForStart() {
    return this.quizPlayerService.quizData.quizState === QuizPlayerState.WaitingForStart
  }

  public isQuizInProgress() {
    return this.quizPlayerService.quizData.quizState === QuizPlayerState.QuestionShowing
      || this.quizPlayerService.quizData.quizState === QuizPlayerState.AnswersShowing
  }

  public isQuizEnd() {
    return this.quizPlayerService.quizData.quizState === QuizPlayerState.End
  }

  public answerStyle(answerId: string) {
    if (this.quizPlayerService.quizData.currentCorrectAnswerId === answerId) {
      return 'correct'
    }
    if (this.quizPlayerService.quizData.currentAnswerId === answerId) {
      return 'answered'
    }
    return ''
  }

  public isPossibleToAnswer(): Boolean {
    return this.quizPlayerService.quizData.currentAnswerId === ""
      && this.quizPlayerService.quizData.quizState === QuizPlayerState.QuestionShowing
  }

  public sendAnswerToHost(id?: string) {
    this.quizPlayerService.questionAnswered(id!)
  }
}
