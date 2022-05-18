import { createReducer, on } from "@ngrx/store";
import { changeName } from "./app.actions";

export const appRootKey: string = 'app';

export interface User {
    name: string;
    email: string;
}

export interface AppState {

}

export const initialState: AppState = {

}

export const appReducer = createReducer(
    initialState,
    on(changeName, (state, action) => {
        return action.payload;
    })
);