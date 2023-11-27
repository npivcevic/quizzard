import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { QuizSettings } from '../model/QuizSettings';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-quiz-settings',
  templateUrl: './quiz-settings.component.html',
  styleUrls: ['./quiz-settings.component.css']
})
export class QuizSettingsComponent implements OnInit {

  quizSettings: QuizSettings = new QuizSettings()

  constructor(
    public fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: QuizSettings,
    private dialogRef: MatDialogRef<QuizSettingsComponent>) { 
      dialogRef.disableClose = true
    }

  quizSetup = this.fb.group({
    totalTimePerQuestion: this.fb.control(this.data.totalTimePerQuestion / 1000, [Validators.required, Validators.min(1)]),
    nextQuestionDelay: this.fb.control(this.data.nextQuestionDelay / 1000, [Validators.required, Validators.min(1)]),
    nextSetDelay: this.fb.control(this.data.nextSetDelay / 1000, [Validators.required, Validators.min(1)]),
    MoveToNextQuestionWhenAllPlayersAnswered: this.fb.control(this.data.MoveToNextQuestionWhenAllPlayersAnswered)
  })

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close()
  }

  saveSettings() {
    if (!this.quizSetup.valid) {
      return
    }
    this.dialogRef.close(this.quizSetup.value)
  }
}
