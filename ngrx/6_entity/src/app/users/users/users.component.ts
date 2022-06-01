import { Component, OnInit } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { AppState } from '../../app.models';
import * as UserAction from './users.actions';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(
    private store: Store<AppState>
  ) {
    this.store.dispatch(UserAction.getUsersFromAPI(0));
    setTimeout(() => {
      this.store.dispatch(UserAction.getUsersFromAPI(1));
    }, 1000);

  }

  ngOnInit(): void {}

}
