import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, exhaustMap, tap } from 'rxjs/operators';
import { failedToGetUsersFromAPI, getUsersFromAPI, setUsers } from "./app.actions";
import { User } from "./app.reducers";

@Injectable()
export class AppEffects {
    constructor(private actions$: Actions, private http: HttpClient) {

    }

    // It hits a mock API
    // On success calls setUsers Action
    // On Error calls failedToGetUsersFromAPI Action
    // {dispatch: false} is commented we are returning Action,
    // If we are not returning an Action, we mention {dispatch: false} else it will go in infinite loop
    // Remember: We need a flattening operator so that it will be subscribed.
    setUserEffect = createEffect(
        () => this.actions$.pipe(
            ofType(getUsersFromAPI),
            exhaustMap((action) => {

                console.log('Action: ', action);

                return this
                    .http
                    .get<Array<User>>('https://6285e99396bccbf32d6aba4f.mockapi.io/api/v1/users')
                    .pipe(
                        map((e: Array<User>) => setUsers({payload: {users: e}})),
                        catchError(error => of(failedToGetUsersFromAPI(error)))
                    )
            })
        ),
        // {dispatch: false}
    );
}