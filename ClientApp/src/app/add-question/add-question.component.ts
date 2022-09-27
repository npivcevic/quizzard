import { Component, OnInit} from '@angular/core';
import { Question } from '../model/question';
import { QuestionService } from '../question.service';
@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  
  constructor(private questionservice : QuestionService) { }

  ngOnInit(): void {

    this.questionservice.getQuestions()
      .subscribe( data => this.questions = data)
    
  }

  question:Question={
    id:"",
    text: "",
    answers:[
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false}
    ]
  }

  public questions:Question[] =[];

  isDisabled:boolean = false

  postQuestion(x: Question){
    
    this.questionservice.postQuestion(this.question)
  }

  toggle(){
    this.isDisabled=!this.isDisabled
    console.log(this.isDisabled) 
  }

}

