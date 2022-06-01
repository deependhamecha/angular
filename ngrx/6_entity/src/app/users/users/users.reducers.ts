import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { ActionReducerMap, createReducer, on } from "@ngrx/store";
import * as UserActions from './users.actions';
import { User, UsersState } from "../../app.models";

export const stateKey = 'users';

export interface UserState extends EntityState<User> {
    
}

export const adapter = createEntityAdapter<User>();

export const initialState = adapter.getInitialState();

export const userReducer = createReducer(
    initialState,
    on(UserActions.setUsers, (state: any, action: any) => {

        console.log("state: ", state);
        console.log("action: ", action);

        // Remember you only care about returning type of State, in this case, AppState
        // return {...state, ...{users: action.payload}};

        return adapter.addMany(action.payload, state);

        // not possible
        // return adapter.addMany([...state.entities, ...action.payload], state);
    })
);
