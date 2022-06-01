import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './users/users.effects';
import { StoreModule } from '@ngrx/store';
import * as fromUserReducer from './users/users.reducers';

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromUserReducer.stateKey, fromUserReducer.userReducer),
    EffectsModule.forFeature([UserEffects])
  ]
})
export class UsersModule { }
