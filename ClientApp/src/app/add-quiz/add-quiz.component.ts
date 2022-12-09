import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PutQuiz, Quiz } from '../model/quiz';
import { QuizzesService } from '../services/quizzes.service';
import { Router } from '@angular/router';
import { QuestionSetService } from '../services/question-set.service';
import { PostQuestionSet, QuestionSet } from '../model/question-set';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';



@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css']
})
export class AddQuizComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Quiz,
    private router: Router,
    public fb: FormBuilder,
    private questionsetservice: QuestionSetService,
    private quizservice: QuizzesService,
    private dialogRef: MatDialogRef<AddQuizComponent>) { }

  defaultQuestionSet: PostQuestionSet = {
    name: "My First Question Set",
    order: 1,
    questions: [],
    quizId: ""
  }

  addQuizForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control('')
  })

  putQuiz:PutQuiz = {
    quizId:"",
    name: "",
    description:""
  }

  isNew!:boolean

  ngOnInit(): void {
    if(this.data){
      this.isNew = false
      this.addQuizForm.setValue({
        name: this.data.name,
        description : this.data.description
      })
      return
    }
    this.isNew = true
  }



  saveQuiz(): void {
    if(!this.isNew){

      this.quizservice.putQuiz(Object.assign(this.addQuizForm.value,{
        quizId: this.data.quizId
      }))
      .subscribe({
        error: (err) => {
          console.log(err)
        },
        complete:() =>{
          this.dialogRef.close()
        }
      })
    return
    }
    this.createQuiz(this.addQuizForm.value)
  }

  createDeafulatQuestionSet(questionSet: PostQuestionSet) {
    this.questionsetservice.postQuestionSet(questionSet)
      .subscribe({
        next: (result) => {
          console.log("this is default question set", result)
        }
      })
  }

  createQuiz(quiz: Quiz): void {
    this.quizservice.postQuiz(quiz)
      .subscribe({
        next: (result) => {
          this.dialogRef.close(result)
          this.defaultQuestionSet.quizId = result.quizId
          this.createDeafulatQuestionSet(this.defaultQuestionSet)
          this.router.navigate(['quizzes', result.quizId])
        }
      })
  }

  cancelAdding() {
    this.dialogRef.close()
  }
}
