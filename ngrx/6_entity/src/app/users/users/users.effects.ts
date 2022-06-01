import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from "rxjs/operators";
import * as UserActions from "./users.actions";
import { User } from "../../app.models";

@Injectable()
export class UserEffects {

    constructor(private actions$: Actions, private http: HttpClient) {

    }

    setUserEffect = createEffect(
        () => this.actions$.pipe(
            ofType(UserActions.getUsersFromAPI),
            exhaustMap((action) => {
                console.log("Action: ", action);

                return this
                    .http
                    .get<Array<User>>('https://6285e99396bccbf32d6aba4f.mockapi.io/api/v1/users')
                    .pipe(
                        map((e: Array<User>) => UserActions.setUsers({payload: e})),
                        tap(e => console.log("In Tap: ", e)),
                        catchError(error => of(UserActions.failedToGetUsersFromAPI(error)))
                    )
            })
        )
    );
}