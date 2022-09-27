import { Component, OnInit} from '@angular/core';
import { PostQuestion } from '../model/post-question';
import { Question } from '../model/question';
import { Questions } from '../model/questions';
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


  postquestion: PostQuestion={
    text:"",
    answers:[
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false}
    ]
  }

  public questions:Questions[] =[];

  isDisabled:boolean = false

  postQuestion(x: PostQuestion){
    
    this.questionservice.postQuestion(this.postquestion)
  }

  toggle(){
    this.isDisabled=!this.isDisabled
    console.log(this.isDisabled) 
  }

}

