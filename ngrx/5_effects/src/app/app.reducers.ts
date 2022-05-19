import { createReducer, on } from "@ngrx/store";
import { failedToGetUsersFromAPI, getUsers, setUsers } from "./app.actions";

export interface User {
    name: string;
    email: string;
}

export interface AppState {
    users: Array<User>;
}

export const initialState: AppState = {
    users: []
};

export const appReducers = createReducer(
    initialState,
    on(setUsers, (state, action) => {
        return action.payload;
    }),
    on(failedToGetUsersFromAPI, (state, action) => {
        return {...state, ...{users: []}};
    })
    // on(getUsers, (state) => {
    //     return state.users;
    // })

);