import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizSettings } from '../model/QuizSettings';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-quiz-settings',
  templateUrl: './quiz-settings.component.html',
  styleUrls: ['./quiz-settings.component.css']
})
export class QuizSettingsComponent implements OnInit {

  quizSettings: QuizSettings = new QuizSettings()

  constructor(public fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: QuizSettings, 
              private dialogRef: MatDialogRef<QuizSettingsComponent>) { }

  quizSetup = this.fb.group({
    numberOfQuestions: this.fb.control(this.quizSettings.numberOfQuestions, [Validators.required, Validators.min(1)]),
    totalTimePerQuestion: this.fb.control(this.quizSettings.nextQuestionDelay / 1000, [Validators.required, Validators.min(1)]),
    nextQuestionDelay: this.fb.control(this.quizSettings.totalTimePerQuestion / 1000, [Validators.required, Validators.min(1)]),
    MoveToNextQuestionWhenAllPlayersAnswered: this.fb.control(this.quizSettings.MoveToNextQuestionWhenAllPlayersAnswered)
  })

  ngOnInit(): void {
  }


  saveSettings(){
    this.dialogRef.close(this.quizSetup.value)
  }

}
