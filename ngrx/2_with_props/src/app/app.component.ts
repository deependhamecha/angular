import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { changeName } from './app.actions';
import { AppState } from './app.reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = '2_with_props';

  constructor(private store: Store<AppState>) {

  }
  
  payload = {
    payload: {
      name: 'Deepen',
      email: 'deependhamecha@gmail.com'
    }
  };

  ngOnInit(): void {
    this.store.dispatch(changeName(this.payload));
  }
}
