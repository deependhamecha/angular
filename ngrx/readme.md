What NGRX fixes?
1. Hitting Unncessary API on page load.
2. Common Store of variables where variables are not tied to components by which page renders variables much faster.
3. Syncing data with backend
4. Avoid Loading of data which is already present by having in-memory database(not exactly).


# NGRX Store

Start by installing ngrx store, this will install and add to package.json and modify `app.module.ts`.

```sh
ng add @ngrx/store
```

Install add a line in **app.module.ts**
```sh
StoreModule.forRoot({}, {})
```

First argument is the object, which you can see in devtools state. Kind of root object.

Remember: You wont be able see anything in **Redux Devtools**. For this, you need to add StoreDevTools
```sh
  ng add @ngrx/store-devtools
```

# Concept

1. We dispatch an **action** from our code, which triggers a **reducer** which changes the state in the **store**.
2. We dispatch an **action** from our code, which triggers a **effect**.
3. We dispatch an **action** from our code, which triggers a **reducer** which changes the state in the **store** which triggers an **effect**.

# Create a Model
```js
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    mobileNumber: string;
}
```

# Create an Action

**user.action.ts**
```js
import { createAction, props } from "@ngrx/store";
import { User } from "src/app/model/all.model";

export const createUser = createAction(
    "[Create User from AppComponent] Create User",
    props<{user: User}>()
);
```

# Create a Reducer
**user.reducer.ts**
```js
import { createReducer, on } from "@ngrx/store";
import { UserActions } from ".";
import { User } from "../../model/all.model";


// State
export interface UserState {
    user: User | null;
}


// Initial State
export const initialUserState: UserState = {
    user: null
};


// Reducer
export const userReducer = createReducer(
    initialUserState,
    on(
        UserActions.createUser,
        (state, action) => {
            return {
                user: action.user
            };
        }
    )
);
```

# Typings file for actions

**app/store/user/index.ts**
```js
import * as UserActions from './user.action';

export { UserActions };
```


# Add State to StoreModule
```js
StoreModule.forRoot({
      user: userReducer
}, {}),
```

# Dispatch an Action
```js
constructor(private store: Store<UserState>) {
    
    let user = {
        id: 1,
        name: 'Dude',
        email: 'dude@gmail.com',
        password: 'abcd1234',
        mobileNumber: '7878787878',
    };
    
    // Calling an action
    // Dispatch an action with data
    this.store.dispatch(UserActions.createUser({user: user}));
}

```

# Listing to Store
```js
constructor(private store: Store<UserState>) {
    this.store.subscribe(e => {
        console.log(e);
    });
}
```

This will emit store values even if there is no change. To avoid this, use **distinctUntilChanged**.
```js
this.store.pipe(
    distinctUntilChanged()
).subscribe(e => {
    console.log("UserState", e);
});
```

# Root State (AppState)
```js
import { UserState } from "../user/user.reducer";

export interface AppState {
    user: UserState
}
```

# Selectors

Selectors are projector functions to look into specific data into state. 
Remember, AppState is root and UserState is feature. We will look into Root and Feature module later. `select` works as map.


## Example 1
```js
// Memoized function
export const isLoggedIn = createSelector(
    state => state['auth'],
    
    // Projector Function, data passed is map value of the above
    (auth) => !!auth.user
);
```
If we use `store.subscribe()`, then it will look into whole store. `createSelector` creates a mapping where specific data will be scoped(2x, 4x, 6px) in the store. In the above example,
```js
state => state['auth']
```
projects the specific state data and later its projector function
```js
(auth) => !!auth.user
```
is using the value to create a calculated functional state. This functional state is called **Memoized function** in functional programming.

This is how you use this selector,
```js
this.isLoggedIn$ = this.store.pipe(
    select(isLoggedIn)
);
```

Now, what if you have a selector and you want to create a different selector which has almost same conditions as one of your previous selector but slightly different or may be negate one selector. What if you can reuse a selector? Consider in this scenario, we are re-using the selector by negating it.

```js
export const isLoggedOut = createSelector(
    state => state['auth'],

    (auth) => !auth.user
);
```

```js
export const isLoggedOut = createSelector(
    isLoggedIn,
    loggedIn => !isLoggedIn
);
```
  Remember: It returns the value of the PROJECTOR function.

## Example 2

Type safety

```js
export const selectAuthState = createFeatureSelector<AuthState>('auth');
```
Create a featureselector where `'auth'` is the key in the store AuthState is the Feature State type mentioned the reducer file.

Now, use this `featureselector` in any selector for type safety.
```js
export const isLoggedIn = createSelector(
    selectAuthState,
    auth => !!auth.user;
);
```

## Example 3
```js
import { createSelector } from "@ngrx/store";
import { AppState } from "../app-state/app-state.reducer";
import { UserState } from "./user.reducer";

export const featureSelector = (state: AppState) => state.user;

export const user = createSelector(
    featureSelector,
    (state: UserState) => state.user
);
```

```js
this
    .store
    .pipe(
        select(userSelector),
        distinctUntilChanged()
    )
    .subscribe(
        e => console.log("User State, ", e)
    );
```

We will dwell into featureSelector word later.

# Effects

1. We dispatch an **action** from our code, which triggers a **effect**.
2. Effects are independent of reducer, however, if reducer, exists then it works after a reducer.
3. Effects emit another action, so everytime we are writing effect, we need to specify that
this particular effect is not dispatching any further action by `{dispatch: false}`. If you do not specify
this then it will be `{dispatch: true}` and it will go into infinite loop.
4. Effects are used to hit API, however, here in this case, we will write to localStorage.

#### Add effect to project
```js
ng add @ngrx/effects
```

This will add following to **app.module.ts**.
```js
EffectsModule.forRoot([])
```

**user.effects.ts**
```js
//Effects look to an action, if triggered call work

import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { UserActions } from ".";

// Simplest way to implement effect
// In Side Effect, you get value after reducer is been executed.
@Injectable()
export class UserEffects {

    constructor(private actions$: Actions) {

        /**
         * Iteration 1
         * 1. Problem here action is a string
         * 2. No type safety
         * 3. Manual subscribe and subscribe is deprecated for Actions
         */
        // Iteration 1
        // actions$.subscribe(action => {
        //     if(action.type == '[Create User from AppComponent] Create User) {
        //         console.log("Inside Effect Login: ", action['user']);
        //         localStorage.setItem('user', JSON.stringify(action['user']))
        //     }
        // });

        /**
         *  Iteration 2
         *  1. No type safety
         *  2. Manual subscribe and subscribe is deprecated for Actions
         */
        // actions$.pipe(
        //     ofType(UserActions.createUser),
        //     tap(action => {
        //         localStorage.setItem('user', JSON.stringify(action['user']));
        //     })
        // ).subscribe();

    }

    /**
     * Iteration 3
     * PERFECT, it will auto subscribe to action, type safe
     */

    userSaveEffect = createEffect(
        () => this.actions$.pipe(
            ofType(UserActions.createUser),
            tap(action => {
                localStorage.setItem('user', JSON.stringify(action.user));
            })
        )
    );
}
```

Remember, `@Injectable()` will be blank and do not specify in any module since NGRX `EffectsModule` will create an instance of it.
Specify that in **app.module.ts**.

```js
EffectsModule.forRoot([UserEffects])
```

# forFeature vs forRoot

```js
{
  user: {
    user: {
      id: 1,
      name: 'Dude',
      email: 'dude@gmail.com',
      password: 'abcd1234',
      mobileNumber: '7878787878'
    }
  }
}
```

We have **user** defined in root and it is hardcoded in `app.module.ts`.

**app.module.ts**
```ts
StoreModule.forRoot({
      user: userReducer
    }, {}),
```
What if we want independent(clean) Root State and Dynamic state which is not hard coded. For this we use Feature State.


**app.module.ts**
```js
StoreModule.forRoot(appReducers),
```

Create an empty reducermap
```js
export const appReducers: ActionReducerMap<AppState> = {
    
};
```


**user.module.ts**
```js
import * as fromUserReducer from '../store/user/user.reducer';
....

StoreModule.forFeature(
    'user', fromUserReducer.userReducer
)
```

**user.action.ts**
```js
export const createUser = createAction(
    "[Create User from AppComponent] Create User",
    props<{data: User}>()
);
```

Modified **user.reducer.ts**

```js

// export interface UserState {
//     user: User | null
// }

export const initialUserState: User = {
    id: 0,
    name: null,
    email: null,
    password: null,
    mobileNumber: null,
};

export const userReducer = createReducer(
    initialUserState,
    on(
        UserActions.createUser,
        (state, action): User => {
            console.log("Reducer called.", action);
            return action.data;
        }
    )
);
```

# Feature Selectors

# Meta Reducers

# Entity
































**************************************
#### Deprecated
**************************************
# Generate Store for a specific module

```sh
ng generate store auth/Auth --module auth.module.ts
```

This will generate reducers, effects for you

**auth.module.ts**
```js
StoreModule.forFeature('auth', fromAuth.reducers, { metaReducers: fromAuth.metaReducers }),
```

Check Redux Devtools in chrome > State


