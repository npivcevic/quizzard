import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { Question } from '../model/question';
import { PostserviceService } from '../postservice.service';
@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  
  constructor(private POST : PostserviceService) { }

  ngOnInit(): void {
  }

  question:Question={
    text: "",
    answers:[
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false}
    ]
  }

  isDisabled:boolean = false

  postQuestion(x: Question){
    
    this.POST.postQuestion(this.question)
  }

  toggle(){
    this.isDisabled=!this.isDisabled
    console.log(this.isDisabled) 
  }

}

