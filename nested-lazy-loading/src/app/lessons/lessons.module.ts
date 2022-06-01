import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonComponent } from '../lessions/lesson/lesson.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LessonComponent
  }
]

@NgModule({
  declarations: [LessonComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LessonsModule {
  // constructor() {
  //   console.log('lessons module constructor called.');
  // }
}
