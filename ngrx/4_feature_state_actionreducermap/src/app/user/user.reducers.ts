import { ActionReducer, ActionReducerMap, createReducer, on } from "@ngrx/store";

import * as fromUserActions from './user.actions';

export const userFeatureKey: string = 'user';

export interface Name {
    firstName: string;
    middleName: string;
    lastName: string;
}
export interface Other {
    email: string;
    age: number;
}

export interface User {
    name: Name;
    other: Other;
}

export const initialUserState: User|{} = {};

export const initialNameState: Name|{} = {};

export const initialOtheState: Other|{} = {};

export const nameReducer = createReducer(
    initialNameState,
    // on(fromUserActions.changeName, (state, action) => {
    //     return action.payload;
    // }),
    // on(fromUserActions.changeFirstName, (state, action) => {
    //     return action.payload;
    // }),
    // on(fromUserActions.changeMiddleName, (state, action) => {
    //     return action.payload;
    // }),
    // on(fromUserActions.changeLastName, (state, action) => {
    //     return action.payload;
    // })


    // Multiple actions on same reducer
    on(
        fromUserActions.changeName,
        fromUserActions.changeFirstName,
        fromUserActions.changeMiddleName,
        fromUserActions.changeLastName,
        (state, action) => {
            return action.payload;
        }
    )
);

export const otherReducer = createReducer(
    initialOtheState,
    on(fromUserActions.changeOther, (state, action) => {
        return action.payload;
    }),
    on(fromUserActions.changeEmail, (state, action) => {
        return action.payload;
    }),
    on(fromUserActions.changeAge, (state, action) => {
        return action.payload;
    })
);


// This Example shows using multiple nested keys with their own reducers
export const userReducer: ActionReducerMap<any> = {
    name: nameReducer,
    other: otherReducer
};