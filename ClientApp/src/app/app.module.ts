import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddQuestionComponent } from './add-question/add-question.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuizHostComponent } from './quiz-host/quiz-host.component';
import { QuizPlayerComponent } from './quiz-player/quiz-player.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SimpleDialogComponent } from './simple-dialog/simple-dialog.component'
import { LogoComponent } from './logo/logo.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { AddQuizComponent } from './add-quiz/add-quiz.component';
import { QuizCreatorComponent } from './quiz-creator/quiz-creator.component';
import { AddQuestionSetComponent } from './add-question-set/add-question-set.component';
import { QuestionLibraryComponent } from './question-library/question-library.component';
import { QuizSettingsComponent } from './quiz-settings/quiz-settings.component';
import { ButtonComponent } from './button/button.component';
import { ButtonIconComponent } from './button-icon/button-icon.component';
import { QuizPreviewComponent } from './quiz-preview/quiz-preview.component';
import { DialogComponent } from './dialog/dialog.component';
import { LoginComponent } from './login/login.component';
import { AuthorizeInterceptor } from '../api-authorization/authorize.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { quizzesGuard } from './guards/quizzes.guard';
import { QuizHostQuestionDisplayComponent } from './quiz-host-question-display/quiz-host-question-display.component';
import { QuizHostTransitionDisplayComponent } from './quiz-host-transition-display/quiz-host-transition-display.component';
import { QuestionsImporterComponent } from './questions-importer/questions-importer.component';
import { ContactPageComponent } from './contact/contact.component';
import { QuizHostFinishDisplayComponent } from './quiz-host-finish-display/quiz-host-finish-display.component';
import { QuizHostAwardComponent } from './quiz-host-award/quiz-host-award.component';
import { QuizHostFunFactComponent } from './quiz-host-fun-fact/quiz-host-fun-fact.component';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FetchDataComponent,
    AddQuestionComponent,
    QuestionsComponent,
    QuizHostComponent,
    QuizPlayerComponent,
    SpinnerComponent,
    SimpleDialogComponent,
    LogoComponent,
    ScoreboardComponent,
    QuizzesComponent,
    AddQuizComponent,
    QuizCreatorComponent,
    AddQuestionSetComponent,
    QuestionLibraryComponent,
    QuizSettingsComponent,
    ButtonComponent,
    ButtonIconComponent,
    QuizPreviewComponent,
    DialogComponent,
    LoginComponent,
    QuizHostQuestionDisplayComponent,
    QuizHostTransitionDisplayComponent,
    QuestionsImporterComponent,
    ContactPageComponent,
    QuizHostFinishDisplayComponent,
    QuizHostAwardComponent,
    QuizHostFunFactComponent,
  ],
  imports: [
    ClipboardModule,
    DragDropModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: QuizPlayerComponent },
      { path: 'quiz-player', component: QuizPlayerComponent },
      { path: 'app-question', component: QuestionsComponent },
      { path: 'quiz-host', component: QuizHostComponent },
      { path: 'quizzes', component: QuizzesComponent, canActivate:[quizzesGuard] },
      { path: 'quizzes/:id', component: QuizCreatorComponent },
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: 'contact', component: ContactPageComponent },
    ]),
    NgxGoogleAnalyticsModule.forRoot('G-TXN0SQD6ME'),
    NgxGoogleAnalyticsRouterModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
