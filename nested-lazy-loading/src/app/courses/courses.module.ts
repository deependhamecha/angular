import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { LessonsModule } from '../lessons/lessons.module';
import { ClassesComponent } from './classes/classes.component';
import { DefaultComponent } from './default/default.component';

const routes: Routes = [
  {
    path: '',
    component: CourseComponent,
    children: [
      {
        path: '',
        component: DefaultComponent
      },
      {
        path: 'classes',
        component: ClassesComponent
      },
      {
        path: 'lessons',
        loadChildren: () => import('../lessons/lessons.module').then(m => m.LessonsModule)
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [CourseComponent, ClassesComponent, DefaultComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // LessonsModule
  ]
})
export class CoursesModule { }
