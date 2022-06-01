import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  constructor(private router: Router) { 
    console.log('Course Component Constructor');
    setTimeout(() => {
      this.router.navigate(['/courses/classes']);
      setTimeout(() => {
        this.router.navigate(['/courses/lessons']);
      }, 2000);
    }, 2000);
  }

  ngOnInit() {
    console.log('Course Component Init');
  }

}
