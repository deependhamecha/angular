import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getUsersFromAPI, setUsers } from './app.actions';
import { AppState } from './app.reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '5_effects';

  constructor(private store: Store<AppState>) {
    this.store.dispatch(getUsersFromAPI());
  }
}
