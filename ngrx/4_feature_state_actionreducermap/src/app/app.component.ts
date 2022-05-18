import { Component } from '@angular/core';
import { State, Store } from '@ngrx/store';
import * as fromUserActions from './user/user.actions';
import { Name } from './user/user.reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '4_feature_state_actionreducermap';

  // payload = {
  //   payload: {
  //     firstName: 'Deepen',
  //     middleName: 'Naresh',
  //     lastName: 'Dhamecha'
  //   }
  // };
  constructor(private store: Store<State<{}>>) {
    // this.store.dispatch(fromUserActions.changeName(this.payload));
  }
}
