import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, State, Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import * as fromUserActions from '../user.actions';
import { Name, User } from '../user.reducers';

import { firstname, fullname, middlename, lastname, email, isAdult } from '../user.selectors';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userForm!: FormGroup;
  otherForm!: FormGroup;

  // Need name Store State
  firstname$!: Observable<string>;
  middlename$!: Observable<string>;
  lastname$!: Observable<string>;
  fullname$!: Observable<string>;
  email$!: Observable<string>;
  isAdult$!: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store<State<{}>>) {

    this.userForm = this.fb.group({
      firstName: new FormControl('', [Validators.required, Validators.minLength(1)]),
      middleName: new FormControl('', [Validators.required, Validators.minLength(1)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(1)])
    });

    this.otherForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.minLength(1)]),
      age: new FormControl(null, [Validators.required, Validators.min(1)])
    });

    this.firstname$ = this.store.pipe(select(firstname));
    this.middlename$ = this.store.pipe(select(middlename));
    this.lastname$ = this.store.pipe(select(lastname));
    this.fullname$ = this.store.pipe(select(fullname));
    this.email$ = this.store.pipe(select(email));
    this.isAdult$ = this.store.pipe(select(isAdult));
  }

  get isUserFormInvalid(): boolean {
    return this.userForm.status == 'INVALID';
  }

  get isOtherFormInvalid(): boolean {
    return this.otherForm.status == 'INVALID';
  }

  ngOnInit(): void {
  }

  onNameSubmit() {
    console.log(this.userForm.value);
    this.store.dispatch(fromUserActions.changeName({payload: this.userForm.value}));
  }

  onOtherSubmit() {
    console.log(this.otherForm.value);
    this.store.dispatch(fromUserActions.changeOther({payload: this.otherForm.value}));
  }

}
