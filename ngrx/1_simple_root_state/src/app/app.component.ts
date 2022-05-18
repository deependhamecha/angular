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
  title = 'ngrx_practice2';

  constructor(private store: Store<AppState>) {}
  
  ngOnInit() {
    this.store.dispatch(changeName());
  }
}
