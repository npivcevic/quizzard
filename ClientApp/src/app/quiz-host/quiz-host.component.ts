import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuizHostService } from '../services/quiz-host.service';
import { NavBarService } from '../nav-bar.service';
import { QuizState } from '../classes/QuizHostData';
import { Player } from '../classes/Player';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizSettings } from '../model/QuizSettings';
import { letterFromIndex } from '../utils/letterFromIndex';
import { Quiz } from '../model/quiz';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { QuizzesService } from '../services/quizzes.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { QuestionSetService } from '../services/question-set.service';
import { MatDialog } from '@angular/material/dialog';
import { QuizSettingsComponent } from '../quiz-settings/quiz-settings.component';
import { QuizCreatorComponent } from '../quiz-creator/quiz-creator.component';

@Component({
  selector: 'app-quiz-host',
  templateUrl: './quiz-host.component.html',
  styleUrls: ['./quiz-host.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class QuizHostComponent implements OnInit, OnDestroy {

  currentSpinnerTimeout!: number
  currentSpinnerText!: string
  quizSettings: QuizSettings = new QuizSettings()

  quizzes!: Quiz[]
  quizId!: string

  displayedColumns: string[] = ['name', 'numberOfQuestions']
  dataSource = new MatTableDataSource<Quiz>(this.quizzes);
  selection = new SelectionModel<Quiz>(true, []);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement!: Quiz | null;

  quizSetup = this.fb.group({
    totalTimePerQuestion: this.fb.control(this.quizSettings.nextQuestionDelay / 1000, [Validators.required, Validators.min(1)]),
    nextQuestionDelay: this.fb.control(this.quizSettings.totalTimePerQuestion / 1000, [Validators.required, Validators.min(1)]),

    MoveToNextQuestionWhenAllPlayersAnswered : this.fb.nonNullable.control(this.quizSettings.MoveToNextQuestionWhenAllPlayersAnswered)
  })

  // quiz = this.fb.group({
  //   quizId: this.fb.control(this.quizId, [Validators.required]),
  //   randomQuestions: this.fb.control(false)
  // })

  constructor(
    public quizHostService: QuizHostService,
    private quizservice: QuizzesService,
    private questionsetservice: QuestionSetService,
    public navbarservice: NavBarService,
    private dialog: MatDialog,
    public fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.navbarservice.visible = false
    this.quizHostService.initialize();
    this.quizHostService.quizData.quizState.subscribe({
      next: (data) => this.quizStateChanged(data)
    })
    this.quizservice.getPublishedQuizzes()
      .subscribe(data => this.dataSource.data = data)
  }

  ngOnDestroy(): void {
    this.navbarservice.visible = true
  }

  openQuizSettingsDialog() {
    const dialog = this.dialog.open(QuizSettingsComponent, {
      width: "30%",
      data: this.quizSettings
    })

    dialog.afterClosed()
      .subscribe(data => {
        if (data) {
          this.quizSettings.nextQuestionDelay = data.nextQuestionDelay! * 1000
          this.quizSettings.totalTimePerQuestion = data.totalTimePerQuestion! * 1000
          this.quizSettings.nextSetDelay = data.nextSetDelay! * 1000
          this.quizSettings.MoveToNextQuestionWhenAllPlayersAnswered = data.MoveToNextQuestionWhenAllPlayersAnswered!
        }
      })
  }

  setQuizId(quiz: Quiz) {
    if (this.quizId === quiz.quizId) 
      {
        console.log("im deselection", quiz.quizId)
        this.quizId = ""
        this.selection.clear()
        return
      }
    if (this.quizId !== quiz.quizId) 
      {
        this.quizId = quiz.quizId
        return
      }
  }

  questionSetName(questionSetId: string) {
    this.questionsetservice.getQuestionSet(questionSetId)
      .subscribe(data => {
        return data.name
      })
  }

  previewQuiz(quizId:string){
    this.quizHostService.previewQuiz(quizId)
  }

  startQuiz(quizId:string) {
    if (!this.quizSetup.valid) {
      return
    }
    this.quizHostService.startQuiz_(this.quizSettings, quizId)
    this.selection.clear();


    this.currentSpinnerText = "Preostalo vrijeme"
    this.currentSpinnerTimeout = this.quizSettings.totalTimePerQuestion
  }

  public quizStateChanged(state: QuizState) {
    if (state === QuizState.AnswersShowing) {
      this.currentSpinnerText = this.quizHostService.quizData.isLastQuestion() ? "Set gotov za" : "Sljedece pitanje"
      this.currentSpinnerTimeout = this.quizSettings.nextQuestionDelay
      return;
    }
    if (state === QuizState.QuestionShowing) {
      this.currentSpinnerText = "Preostalo vrijeme"
      this.currentSpinnerTimeout = this.quizSettings.totalTimePerQuestion
      return;
    }
    if (state === QuizState.SetDelayShowing) {
      this.currentSpinnerText = "Novi set za"
      this.currentSpinnerTimeout = this.quizSettings.nextSetDelay
      return;
    }
  }

  public spinnerTimeout() {
    if (this.quizHostService.quizData.quizState.getValue() === QuizState.AnswersShowing || this.quizHostService.quizData.quizState.getValue() === QuizState.SetDelayShowing) {
      this.quizHostService.nextQuestion();
      return;
    }
    this.quizHostService.showCorrectAnswer();
  }

  isShowingAnswers() {
    return this.quizHostService.quizData.quizState.getValue() === QuizState.AnswersShowing
  }

  isQuizPreview() {
    return this.quizHostService.quizData.quizState.getValue() === QuizState.QuizPreview
  }

  isShowingQuestion() {
    return this.quizHostService.quizData.quizState.getValue() === QuizState.QuestionShowing
  }

  isIdle() {
    return this.quizHostService.quizData.quizState.getValue() === QuizState.Idle
  }

  isShowingSetDelay() {
    return this.quizHostService.quizData.quizState.getValue() === QuizState.SetDelayShowing
  }

  playerCardClass(player: Player) {
    if (this.quizHostService.quizData.quizState.getValue() === QuizState.Idle) {
      return ""
    }

    if (this.quizHostService.quizData.quizState.getValue() === QuizState.QuestionShowing) {
      return player.hasAnswered(this.quizHostService.quizData.currentQuestion.questionId) ? "answered" : ""
    }

    if (!player.hasAnswered(this.quizHostService.quizData.currentQuestion?.questionId)) {
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();

      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Quiz): string {
    if (!row) {

      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }
}
