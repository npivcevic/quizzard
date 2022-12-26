import { Component, OnInit } from '@angular/core';
import { QuestionSet } from 'src/app/model/question-set';
import { QuestionSetService } from 'src/app/services/question-set.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AddQuestionSetComponent } from '../add-question-set/add-question-set.component';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { QuizzesService } from '../services/quizzes.service';
import { Quiz } from '../model/quiz';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AddQuizComponent } from '../add-quiz/add-quiz.component';


@Component({
  selector: 'app-quiz-creator',
  templateUrl: './quiz-creator.component.html',
  styleUrls: ['./quiz-creator.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class QuizCreatorComponent implements OnInit {

  constructor(private questionsetservice: QuestionSetService,
              private route: ActivatedRoute,
              private quizservice: QuizzesService,
              private dialog: MatDialog,
              private snack: MatSnackBar) { }

  quiz!: Quiz
  panelOpenState = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')
      if (!id) {
        return
      }
      this.quizservice.getQuiz(id)
        .subscribe({
          next: (data) => {
            this.quiz = data
          }
        })
    })
  }

  questionSetOrder(_questionSetId:string){
    return this.quiz.questionSets.findIndex(set=>{
      return set.questionSetId === _questionSetId
    })
  }

  reorderQuestionSetsOnBack(){
    this.quiz.questionSets.forEach((set,index)=>{
      let qSet = Object.assign(set,{
        order:index
      })
      this.questionsetservice.putQuestionSet(qSet)
      .subscribe()
    })
  }

  moveQuestionSetUp(questionset:QuestionSet){
    this.quiz.questionSets.forEach((set,index)=>{
      if(questionset.questionSetId === set.questionSetId){
        this.quiz.questionSets.splice(index,1)
        this.quiz.questionSets.splice(index-1,0,set)
        this.reorderQuestionSetsOnBack()
        return
      }
    })
  }

  moveQuestionSetDown(questionset:QuestionSet, index:number){
    this.quiz.questionSets.splice(index,1)
    this.quiz.questionSets.splice(index+1,0,questionset)
    this.reorderQuestionSetsOnBack()
  }

  openPutQuizDialog(): void {
    const dialog = this.dialog.open(AddQuizComponent, {
      width: '90%',
      data: {
        quizId: this.quiz.quizId,
        name: this.quiz.name,
        description: this.quiz.description
      }
    })

    dialog.afterClosed().subscribe({
      next: result => {
        this.quizservice.getQuiz(this.quiz.quizId)
          .subscribe({
            next: (data) => {
              this.quiz = data
              this.openSnackBar("Kviz je spremljen")
            }
          })
      },
      error: (error) => {
        this.openSnackBar("Kviz nije spremljen")
      }
    })
  }

  deleteQuestionSet(questionSetId: string) {
    this.deleteQuestionSetOnClient(questionSetId)
    this.deleteQuestionSetOnBase(questionSetId)
      .subscribe({
        next: ()=>{
          this.reorderQuestionSetsOnBack()
        },
        complete: () => {
          return this.openSnackBar("Set pitanja je izbrisan")
        },
        error: (err) => {
          return this.openSnackBar("Set pitanja nije izbrisan")
        }
      })
  }

  deleteQuestionSetOnBase(questionSetId: string) {
    return this.questionsetservice.deleteQuestionSet(questionSetId)
  }

  deleteQuestionSetOnClient(questionSetId: string) {
    this.quiz.questionSets.forEach((set,index)=>{
      if(questionSetId === set.questionSetId){
        this.quiz.questionSets.splice(index,1)
      }
    })
  }

  openPutQuestionSetDialog(questionSet: QuestionSet): void {
    const dialog = this.dialog.open(AddQuestionSetComponent, {
      width: '50%',
      data: questionSet
    })

    dialog.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.quiz.questionSets.forEach(set => {
            if(set.questionSetId === result.questionSetId){
              set.name = result.name
              return
            }
          });
          this.openSnackBar("Set pitanja je promijenjen")
        }
      }
    })
  }

  openPostQuestionSetDialog(): void {
    const dialog = this.dialog.open(AddQuestionSetComponent, {
      width: '50%',
      data : {
        quizId:this.quiz.quizId,
        order:this.quiz.questionSets.length
      }
    })

    dialog.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.quiz.questionSets.push(result)
        }
      },
      error: (error) => {
        this.openSnackBar("Set nije spremljen")
      }
    })
  }

  openSnackBar(message: string, duration: number = 2000): void {
    this.snack.open(message, "", { duration: duration });
  }
}
