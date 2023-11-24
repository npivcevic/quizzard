import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostQuestion } from '../model/question';
import { QuestionService } from '../question.service';
import { CSVToArray } from '../utils/csvParser';

@Component({
  selector: 'app-questions-importer',
  templateUrl: './questions-importer.component.html',
  styleUrls: ['./questions-importer.component.css']
})
export class QuestionsImporterComponent {
  file: any;
  constructor (private questionService: QuestionService,
    private dialogRef: MatDialogRef<QuestionsImporterComponent>,
    private snack: MatSnackBar) {};

  questionsToImport: PostQuestion[] = []
  questionsWithErrors: number[] = []

  public fileChanged(e: any | null) {
    this.file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      const parsedContent = CSVToArray(fileReader.result)
      this.parseContentToBeImported(parsedContent)
    }
    fileReader.readAsText(this.file);
  }

  parseContentToBeImported(parsedContent: any) {
    for (let i = 1; i < parsedContent.length; i++) {
      let answers = parsedContent[i][3].split(",");
      let answersObjects = answers.map((a: string) => 
        {
          return {
            text: a,
            isCorrect: a.trim() === parsedContent[i][4].trim(),
          }
        }
      )

      let oneCorrect = false;

      answersObjects.forEach((el:any) => {
        if (el.isCorrect) {
          oneCorrect = true;
        }
      });

      this.questionsToImport.push(
        {
        text: parsedContent[i][2],
        order: 0,
        answers: answersObjects,
        questionSetId: null,
        fact: parsedContent[i][5]
      });

      if (!parsedContent[i][2] || !parsedContent[i][3] || !parsedContent[i][4] || !oneCorrect) {
        this.questionsWithErrors.push(i+1);
      }
    }
  }

  importQuestions() {
      this.questionService.postQuestionBulk(this.questionsToImport
      ).subscribe({
        next: result => {
          this.openSnackBar("Pitanja uspješno upisana.")
          this.dialogRef.close()
        },
        error: (error) => {
          this.openSnackBar("Greška prilikom unosa pitanja. Pokušaj ponovno.")
        }
      });
  }

  openSnackBar(message: string, duration: number = 2000): void {
    this.snack.open(message, "", { duration: duration });
  }
}

