import { createAction, props } from "@ngrx/store";
import { User } from "./app.reducers";

export const changeName = createAction(
    "[AppComponent] Change Name",
    props<{payload: User}>()
);