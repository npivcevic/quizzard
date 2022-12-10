import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuizHostService } from '../services/quiz-host.service';
import { NavBarService } from '../nav-bar.service';
import { QuizState } from '../classes/QuizHostData';
import { Player } from '../classes/Player';
import { FormBuilder, Validators } from '@angular/forms';
import { QuizSettings } from '../model/QuizSettings';
import { letterFromIndex } from '../utils/letterFromIndex';


@Component({
  selector: 'app-quiz-host',
  templateUrl: './quiz-host.component.html',
  styleUrls: ['./quiz-host.component.css']
})
export class QuizHostComponent implements OnInit, OnDestroy {

  currentSpinnerTimeout!: number
  currentSpinnerText!: string
  quizSettings: QuizSettings = new QuizSettings()

  quizSetup = this.fb.group({
    numberOfQuestions: this.fb.control(this.quizSettings.numberOfQuestions, [Validators.required, Validators.min(1)]),
    totalTimePerQuestion: this.fb.control(this.quizSettings.nextQuestionDelay / 1000, [Validators.required, Validators.min(1)]),
    nextQuestionDelay: this.fb.control(this.quizSettings.totalTimePerQuestion / 1000, [Validators.required, Validators.min(1)]),
    MoveToNextQuestionWhenAllPlayersAnswered : this.fb.control(this.quizSettings.MoveToNextQuestionWhenAllPlayersAnswered)
  })

  constructor(public quizHostService: QuizHostService, 
              public navbarservice: NavBarService, 
              public fb: FormBuilder,
              private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.navbarservice.visible = false
    this.quizHostService.initialize();
    this.quizHostService.quizData.quizState.subscribe({
      next: (data) => this.quizStateChanged(data)
    })
  }
  
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  ngOnDestroy(): void {
    this.navbarservice.visible = true
  }

  startQuiz() {
    if (!this.quizSetup.valid) {
      return
    }
    this.quizSettings.numberOfQuestions = this.quizSetup.value.numberOfQuestions!
    this.quizSettings.nextQuestionDelay = this.quizSetup.value.nextQuestionDelay! * 1000
    this.quizSettings.totalTimePerQuestion = this.quizSetup.value.totalTimePerQuestion! * 1000
    this.quizSettings.MoveToNextQuestionWhenAllPlayersAnswered = this.quizSetup.value.MoveToNextQuestionWhenAllPlayersAnswered!

    this.quizHostService.startQuiz(this.quizSettings)

    this.currentSpinnerText = "Preostalo vrijeme"
    this.currentSpinnerTimeout = this.quizSettings.totalTimePerQuestion
  }

  public quizStateChanged(state: QuizState) {
    if (state === QuizState.AnswersShowing) {
      this.currentSpinnerText = this.quizHostService.quizData.isLastQuestion() ? "Kviz gotov za" : "Sljedece pitanje"
      this.currentSpinnerTimeout = this.quizSettings.nextQuestionDelay
      return;
    }
    if (state === QuizState.QuestionShowing) {
      this.currentSpinnerText = "Preostalo vrijeme"
      this.currentSpinnerTimeout = this.quizSettings.totalTimePerQuestion
      return;
    }
  }

  public spinnerTimeout() {
    if (this.quizHostService.quizData.quizState.getValue() === QuizState.AnswersShowing) {
      this.quizHostService.nextQuestion();
      return;
    }
    this.quizHostService.showCorrectAnswer();
  }

  isShowingAnswers() {
    return this.quizHostService.quizData.quizState.getValue() === QuizState.AnswersShowing
  }

  isShowingQuestion() {
    return this.quizHostService.quizData.quizState.getValue() === QuizState.QuestionShowing
  }

  isIdle() {
    return this.quizHostService.quizData.quizState.getValue() === QuizState.Idle
  }

  playerCardClass(player: Player) {
    if (this.quizHostService.quizData.quizState.getValue() === QuizState.Idle) {
      return ""
    }

    if (this.quizHostService.quizData.quizState.getValue() === QuizState.QuestionShowing) {
      return player.hasAnswered(this.quizHostService.quizData.currentQuestion.questionId) ? "answered" : ""
    }

    if (!player.hasAnswered(this.quizHostService.quizData.currentQuestion.questionId)) {
      return ""
    }

    if (player.hasAnsweredCorrectly(this.quizHostService.quizData.currentQuestion.questionId)) {
      return "correct"
    }

    return "incorrect"
  }

  getLetter(n: number) {
    return letterFromIndex(n)
  }
}
