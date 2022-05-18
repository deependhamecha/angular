import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { StoreModule } from '@ngrx/store';
import * as fromUserReducer from './user.reducers';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromUserReducer.userFeatureKey, fromUserReducer.userReducer),
    ReactiveFormsModule
  ],
  exports: [UserComponent]
})
export class UserModule { }
