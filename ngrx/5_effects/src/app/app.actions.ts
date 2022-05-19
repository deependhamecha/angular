import { createAction, props } from "@ngrx/store";
import { AppState } from "./app.reducers";

export const setUsers = createAction(
    "[AppComponent] Set All Users",
    props<{payload: AppState}>()
);

export const getUsers = createAction(
    "[AppComponent] Get All Users"
);

export const getUsersFromAPI = createAction(
    "[AppComponent] Get Users from APi"
);

export const failedToGetUsersFromAPI = createAction(
    "[AppComponent] Failed to Get Users from APi",
    props<any>()
);