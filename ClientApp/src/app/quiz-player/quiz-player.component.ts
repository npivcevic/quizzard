import { Component, OnInit } from '@angular/core';
import { QuizPlayerState } from '../classes/QuizPlayerData';
import { QuizPlayerService } from '../services/quiz-player.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { letterFromIndex } from '../utils/letterFromIndex';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { MatDialog } from '@angular/material/dialog';
import { PlayerScore } from '../model/player-score';

@Component({
  selector: 'app-quiz-player',
  templateUrl: './quiz-player.component.html',
  styleUrls: ['./quiz-player.component.css']
})
export class QuizPlayerComponent implements OnInit {

  logInForm = this.fb.group({
    groupName: this.fb.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    playerName: this.fb.control(localStorage.getItem('playerName') || "", [Validators.required, Validators.minLength(2), Validators.maxLength(25)])
  })

  constructor(public quizPlayerService: QuizPlayerService, public dialog: MatDialog, public fb: UntypedFormBuilder) { }

  async ngOnInit() {
    await this.quizPlayerService.initialize();
    if (this.quizPlayerService.quizData.reconnectPossible) {
      this.logInForm.patchValue({
        groupName: this.quizPlayerService.loadLastConnection()?.groupName || ""
      })
    }
  }
  public openPlayerScoreDetails(details: PlayerScore[]) {
    const dialog = this.dialog.open(ScoreboardComponent, {
      data: details,
      width: '90%'
    })
    dialog.afterClosed()
  }

  public joinQuiz() {
    this.quizPlayerService.joinQuiz(this.logInForm.value.groupName!, this.logInForm.value.playerName!)
    localStorage.setItem('playerName', this.logInForm.value.playerName!)
  }

  public reconnectToQuiz() {
    this.quizPlayerService.reconnectToQuiz()
  }

  public isLoading() {
    return this.quizPlayerService.quizData.quizState === QuizPlayerState.Loading
  }

  public isDisconnected() {
    return this.quizPlayerService.quizData.quizState === QuizPlayerState.Disconnected
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

  public isSetDelayShowing() {
    return this.quizPlayerService.quizData.quizState === QuizPlayerState.SetDelayShowing
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

  public sendAnswerToHost(answerText:string ,id?: string) {
    console.log(id)
    console.log(answerText)

    this.quizPlayerService.questionAnswered(answerText,id!)
  }


  getLetter(n: number) {
    return letterFromIndex(n)
  }
}
