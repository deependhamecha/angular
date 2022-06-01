import { createAction, props } from "@ngrx/store";
import { User } from "../../app.models";

export const getUsersFromAPI = createAction(
    "[AppComponent] Get Users from API",
    props<Number>()
);

export const setUsers = createAction(
    "[AppComponent] Set Users to State",
    props<{payload: Array<User>}>()
);

export const failedToGetUsersFromAPI = createAction(
    "[AppComponent] Failed to Get Users from API",
    props<any>()
);