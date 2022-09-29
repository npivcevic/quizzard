import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question } from '../model/question';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-put-question',
  templateUrl: './put-question.component.html',
  styleUrls: ['./put-question.component.css']
})
export class PutQuestionComponent implements OnInit {

<<<<<<< HEAD

  constructor(@Inject(MAT_DIALOG_DATA) public data:Question, private questionservice : QuestionService) { }



=======
  constructor(@Inject(MAT_DIALOG_DATA) public data:Question,private questionservice: QuestionService) { }
>>>>>>> 117b5d95cc5cf62301369533b4f96626324becf6
  
  ngOnInit(): void {
  }

<<<<<<< HEAD

  test(id:string, x:Question){
    console.log(this.data)
    this.questionservice.putQuestion(id, x)
  } 

=======
>>>>>>> 117b5d95cc5cf62301369533b4f96626324becf6
  question:Question={

    id:"",
    text:"",
    answers:[
      {text:this.data.answers[0].text,isCorrect:false},
      {text:"",isCorrect:false},
      {text:"",isCorrect:false},
      {text:"",isCorrect:false}
    ]
  }

  putQuestion(id:string, question:Question){

    this.questionservice.putquestion(id, this.question)
  }
  
<<<<<<< HEAD


=======
  test(){
    console.log(this.question)
  }
>>>>>>> 117b5d95cc5cf62301369533b4f96626324becf6
}
