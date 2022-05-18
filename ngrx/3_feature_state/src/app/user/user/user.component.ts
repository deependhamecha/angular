import { Component, OnInit } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.module';
import { fromUserActions } from '..';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  // Specify Type as State and its generic type as plain {}
  constructor(private store: Store<AppState>) {}

  payload = {
    payload: {
      name: 'Deepen',
      email: 'deependhamecha@gmail.com'
    }
  };

  ngOnInit(): void {
    this.store.dispatch(fromUserActions.changeName(this.payload));
  }

}
