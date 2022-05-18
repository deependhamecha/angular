import { createAction, props } from "@ngrx/store";
import { User } from "./user.reducers";

export const changeName = createAction(
    "[AppComponent] Change Name",
    props<{payload: User}>()
);