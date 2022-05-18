import { createReducer, on } from "@ngrx/store";
import { changeName } from "./app.actions";

export const appRootKey: string = 'app';

export interface AppState { }

export const initialState: AppState = { };

export const appReducer = createReducer(
    initialState,
    on(changeName, (state) => {
        return {name: 'Deepen'};
    })
);