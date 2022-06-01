import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  constructor() { 
    console.log('Lesson Component Constructor');
  }

  ngOnInit() {
    console.log('Lesson Component Init');
  }
}
