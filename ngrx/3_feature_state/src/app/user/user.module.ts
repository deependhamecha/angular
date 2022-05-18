import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { StoreModule } from '@ngrx/store';
import * as fromUserReducer from './user.reducers';



@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromUserReducer.userFeatureKey, fromUserReducer.userReducer)
  ],
  exports: [UserComponent]
})
export class UserModule { }
