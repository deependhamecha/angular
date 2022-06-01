import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { LeavesRoutingModule } from './leaves-routing.module';
import { LeavesComponent } from './leaves.component';
import { ApplyComponent } from './apply/apply.component';
import { Page404leavesComponent } from './page404leaves/page404leaves.component';
 
 
@NgModule({
  declarations: [
    LeavesComponent,
    ApplyComponent,
    Page404leavesComponent
  ],
  imports: [
    CommonModule,
    LeavesRoutingModule,
  ]
})
export class LeavesModule { }