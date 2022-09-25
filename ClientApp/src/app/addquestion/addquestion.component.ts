import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../interface/question';


@Component({
  selector: 'app-addquestion',
  templateUrl: './addquestion.component.html',
  styleUrls: ['./addquestion.component.css']
})
export class AddquestionComponent implements OnInit {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { 
  }

  question : Question = {
  text: "", 
  answers:[
  { text:"" ,isCorrect: true },
  { text:"" ,isCorrect: true },
  { text:"" ,isCorrect: true },
  { text:"" ,isCorrect: true }
]
}

  ngOnInit(): void {
  }

    addQuestion(){

      console.log(this.question)
      this.http.post(this.baseUrl + "api/Questions", this.question)
      .subscribe((response)=>{
        console.log(response)
      })
    }
}

