import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';

import {ClipboardModule} from '@angular/cdk/clipboard';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddQuestionComponent } from './add-question/add-question.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuizHostComponent } from './quiz-host/quiz-host.component';
import { QuizPlayerComponent } from './quiz-player/quiz-player.component';
import { SpinnerComponent } from './spinner/spinner.component';

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
  ],
  imports: [
    ClipboardModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: QuizPlayerComponent, pathMatch: 'full' },
      { path: 'app-question', component: QuestionsComponent, canActivate: [AuthorizeGuard]  },
      { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthorizeGuard] },
      { path: 'quiz-host', component: QuizHostComponent },
    ]),
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
