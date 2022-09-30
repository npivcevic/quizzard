import { Component, OnInit} from '@angular/core';
import { PostQuestion } from '../model/post-question';
import { QuestionService } from '../question.service';

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

  postQuestion(x: PostQuestion){

    this.questionservice.postQuestion(x)
  }

  
  singleToggle( index:number){
   
    this.postquestion.answers.forEach(answer => {
      answer.isCorrect= false
      if (answer.text=this.postquestion.answers[index].text) {
        this.postquestion.answers[index].isCorrect=true
      }
    });    
    console.log(this.postquestion)
  }

  /*
  singleToggle1( index:number){
   
    for (let i=0;i<this.postquestion.answers.length;i++){
      this.postquestion.answers[i].isCorrect=false
      if (this.postquestion.answers[i].text=this.postquestion.answers[index].text) {
        this.postquestion.answers[i].isCorrect=true
      }
    }
    console.log(this.postquestion)
  }
  */
  

}

