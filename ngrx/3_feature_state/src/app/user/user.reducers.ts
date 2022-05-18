import { ActionReducerMap, createReducer, on } from "@ngrx/store";
import * as fromUserActions from "./user.actions";

export const userFeatureKey: string = 'user';

export interface User {
    name: string;
    email: string;
}

export const initialState: User|{} = {};

export const userReducer = createReducer(
    initialState,
    on(fromUserActions.changeName, (state, action) => {
        return action.payload;
    })
);
