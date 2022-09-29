import { Component, OnInit} from '@angular/core';
import { PostQuestion } from '../model/post-question';
import { QuestionService } from '../question.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

 

  constructor(private questionservice : QuestionService) { }

  ngOnInit(): void {
  }

  postquestion: PostQuestion={
    text: "",
    answers:[
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false},
      {text:"", isCorrect:false}
    ]
  }

  questionText = new FormControl(this.postquestion.text)

  postQuestion(x: PostQuestion){

     
    this.questionservice.postQuestion(x)
  }

  

}

