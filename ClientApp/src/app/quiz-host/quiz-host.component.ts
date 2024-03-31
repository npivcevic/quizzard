import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { QuizHostService } from '../services/quiz-host.service';
import { NavBarService } from '../nav-bar.service';
import { QuizState } from '../classes/QuizHostData';
import { Player } from '../classes/Player';
import { UntypedFormBuilder, Validators } from '@angular/forms';
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
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import anime from 'animejs/lib/anime.es.js';
import { detectMobileDevice } from '../utils/mobileDeviceDetector';

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
export class QuizHostComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('activePlayers') activePlayersComponent!: ElementRef<HTMLDivElement>;

  currentSpinnerTimeout!: number
  currentSpinnerText!: string
  detectMobileDevice = detectMobileDevice
  quizzes!: Quiz[]
  quizId!: string

  displayedColumns: string[] = ['name', 'numberOfQuestions']
  dataSource = new MatTableDataSource<Quiz>(this.quizzes);
  selection = new SelectionModel<Quiz>(true, []);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement!: Quiz | null;

  quizState: QuizState = QuizState.Idle


  quizSetup = this.fb.group({
    totalTimePerQuestion: this.fb.control(this.quizHostService.quizSettings.nextQuestionDelay / 1000, [Validators.required, Validators.min(1)]),
    nextQuestionDelay: this.fb.control(this.quizHostService.quizSettings.totalTimePerQuestion / 1000, [Validators.required, Validators.min(1)]),

    MoveToNextQuestionWhenAllPlayersAnswered: this.fb.nonNullable.control(this.quizHostService.quizSettings.MoveToNextQuestionWhenAllPlayersAnswered)
  })

  showMorePlayersPill = false;

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

  ngAfterViewInit() {
    this.initPlayerListObservers()
  }

  ngOnDestroy(): void {
    this.navbarservice.visible = true
  }

  openQuizSettingsDialog() {
    const dialog = this.dialog.open(QuizSettingsComponent, {
      width: "30%",
      data: this.quizHostService.quizSettings
    })

    dialog.afterClosed()
      .subscribe(data => {
        if (data) {
          const newSettings = new QuizSettings()

          newSettings.nextQuestionDelay = data.nextQuestionDelay! * 1000
          newSettings.totalTimePerQuestion = data.totalTimePerQuestion! * 1000
          newSettings.nextSetDelay = data.nextSetDelay! * 1000
          newSettings.MoveToNextQuestionWhenAllPlayersAnswered = data.MoveToNextQuestionWhenAllPlayersAnswered!

          this.quizHostService.quizSettings = newSettings
        }
      })
  }

  setQuizId(quiz: Quiz) {
    if (this.quizId === quiz.quizId) {
      console.log("im deselection", quiz.quizId)
      this.quizId = ""
      this.selection.clear()
      return
    }
    if (this.quizId !== quiz.quizId) {
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

  previewQuiz(quizId: string) {
    this.quizHostService.previewQuiz(quizId)
  }

  startQuiz(quizId: string) {
    if (!this.quizSetup.valid) {
      return
    }
    this.quizHostService.startQuiz_(this.quizHostService.quizSettings, quizId)
    this.selection.clear();


    this.currentSpinnerText = "Preostalo vrijeme"
    this.currentSpinnerTimeout = this.quizHostService.quizSettings.totalTimePerQuestion
  }

  public quizStateChangedAnimated(state: QuizState) {
    if (state === QuizState.QuestionShowing) {
      this.showOverlay(() => this.quizStateChanged(state))
      return
    }
    this.quizStateChanged(state)
  }

  public quizStateChanged(state: QuizState) {
    this.quizState = state

    if (state === QuizState.AnswersShowing) {
      this.currentSpinnerText = this.quizHostService.quizData.isLastQuestion() ? "Set gotov za" : "Sljedece pitanje"
      this.currentSpinnerTimeout = this.quizHostService.quizSettings.nextQuestionDelay
      return;
    }
    if (state === QuizState.QuestionShowing) {
      this.currentSpinnerText = "Preostalo vrijeme"
      this.currentSpinnerTimeout = this.quizHostService.quizSettings.totalTimePerQuestion
      return;
    }
    if (state === QuizState.SetDelayShowing) {
      this.currentSpinnerText = ""
      this.currentSpinnerTimeout = this.quizHostService.quizSettings.nextSetDelay
      return;
    }
  }

  setQuizStateToIdle() {
    this.quizHostService.quizData.quizState.next(QuizState.Idle)
  }

  public openPlayerScoreDetails(details: any, playerName: string) {
    const dialog = this.dialog.open(ScoreboardComponent, {
      data: {
        playerName: playerName,
        score: details
      },
      width: '90%'
    })
    dialog.afterClosed()
  }

  public spinnerTimeout() {
    if (this.quizState === QuizState.AnswersShowing || this.quizState === QuizState.SetDelayShowing || this.quizState === QuizState.QuizStartDelayShowing) {
      this.showOverlay(() => this.quizHostService.nextQuestion())
      return;
    }
    this.quizHostService.showCorrectAnswer();
  }

  isShowingAnswers() {
    return this.quizState === QuizState.AnswersShowing
  }

  isQuizPreview() {
    return this.quizState === QuizState.QuizPreview
  }

  isShowingQuestion() {
    return this.quizState === QuizState.QuestionShowing
  }

  isIdle() {
    return this.quizState === QuizState.Idle
  }

  isShowingSetDelay() {
    return this.quizState === QuizState.SetDelayShowing
  }

  isAfterQuiz() {
    return this.quizState === QuizState.AfterQuiz
  }

  isQuizStartDelayShowing() {
    return this.quizState === QuizState.QuizStartDelayShowing
  }

  playerCardClass(player: Player) {
    if (this.quizState === QuizState.Idle) {
      return ""
    }

    if (this.quizState === QuizState.AfterQuiz) {
      return ""
    }

    if (this.quizState === QuizState.SetDelayShowing) {
      return ""
    }

    if (this.quizState === QuizState.QuestionShowing) {
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

  showOverlay(callback: () => void) {
    let overlay = document.querySelector('.quizOverlay') as HTMLElement;

    let animation = anime.timeline({
      autoplay: true,
      duration: 1000
    });

    animation
      .add({
        targets: overlay,
        duration: 1000,
        width: "100%",
        easing: 'easeInOutExpo',
        complete: function (tl) {
          overlay.style.right = "0";
          overlay.style.left = "auto";
          callback()
        }
      })
      .add({
        targets: overlay,
        duration: 800,
        width: "0",
        easing: 'easeInOutExpo',
        complete: function (tl) {
          overlay.style.right = "auto";
          overlay.style.left = "0";
        }
      })
  }

  initPlayerListObservers() {
    if (!this.activePlayersComponent) {
      return
    }
    this.showMorePlayersPill = this.playerListIsOverflowing() && !this.playerListIsScrolledToBottom();

    const config = { attributes: false, childList: true, subtree: false };
    const observer = new MutationObserver((mutations, observer) => {
      this.updateShowMorePlayersPill()
    });
    observer.observe(this.activePlayersComponent.nativeElement, config);

    this.activePlayersComponent.nativeElement.addEventListener('scroll', (event) => {
      this.updateShowMorePlayersPill();
    })

    window.addEventListener('resize', (event) => {
      this.updateShowMorePlayersPill();
    })
  }

  updateShowMorePlayersPill() {
    this.showMorePlayersPill = this.playerListIsOverflowing() && !this.playerListIsScrolledToBottom();
  }

  playerListIsOverflowing ()
  {
      var container = this.activePlayersComponent.nativeElement;
      console.log('client height', container.clientHeight, 'scroll height', container.scrollHeight)
      return container.clientHeight < container.scrollHeight;
  }

  playerListIsScrolledToBottom ()
  {
      var element = this.activePlayersComponent.nativeElement;
      return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
  }
}
