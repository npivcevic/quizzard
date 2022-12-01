import { Component, Input, OnInit } from '@angular/core';
import { QuestionSet } from 'src/app/model/question-set';
import { QuestionSetService } from 'src/app/services/question-set.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionSetComponent } from '../add-question-set/add-question-set.component';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-quiz-creator',
  templateUrl: './quiz-creator.component.html',
  styleUrls: ['./quiz-creator.component.css']
})
export class QuizCreatorComponent implements OnInit {

  constructor(public questionsetservice:QuestionSetService, private dialog : MatDialog, private snack: MatSnackBar) { }

  @Input() name!:string
  @Input() description!:string
  @Input() quizId!:string

  questionSets!:QuestionSet[]
  questionSetsForQuiz:QuestionSet[]=[]



  ngOnInit(): void {
    this.questionsetservice.getQuestionSets()
    .subscribe(data => this.questionSets = data)
  }

  openPostQuestionSetDialog():void {
    const dialog = this.dialog.open(AddQuestionSetComponent, {
      width: '50%',
    })

    dialog.afterClosed().subscribe({
      next: result => {
        if (result) {
          console.log(result)
          
        }
      },
      error: (error) => {
        this.openSnackBar("Kviz nije spremljen")
      }
    })
  }

  openSnackBar(message: string, duration: number = 2000): void {
    this.snack.open(message, "", { duration: duration });
  }

  drop(event: CdkDragDrop<QuestionSet[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    console.log("pitanja za kviz",this.questionSetsForQuiz)
  }

}
