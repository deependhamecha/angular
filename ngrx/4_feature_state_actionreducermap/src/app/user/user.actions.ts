import { createAction, props } from "@ngrx/store";
import { Name, Other } from "./user.reducers";

/***
 * Name Feature Key Actions
 */
export const changeName = createAction(
    "[UserComponent] Change Name",
    props<{payload: Name}>()
);

export const changeFirstName = createAction(
    "[UserComponent] Change First Name",
    props<{payload: string}>()
);

export const changeMiddleName = createAction(
    "[UserComponent] Change Middle Name",
    props<{payload: string}>()
);

export const changeLastName = createAction(
    "[UserComponent] Change Last Name",
    props<{payload: string}>()
);

/**
 * Other Feature Key Actions
 */
export const changeOther = createAction(
    "[UserComponent] Change Other",
    props<{payload: Other}>()
);

export const changeEmail = createAction(
    "[UserComponent] Change Email",
    props<{payload: string}>()
);

export const changeAge = createAction(
    "[UserComponent] Change Age",
    props<{payload: number}>()
);