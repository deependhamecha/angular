# Topics:
1. [What NgRx fixes?](#what-ngrx-fixes)
2. [NgRx Store](#NgRx-Store)
3. [Concept: NgRx Actions, Reducers, dispatch an action](#concept)
4. [NgRx Selectors](#selectors)
5. [NgRx Effects](#effects)
6. [NgRx Component Store](#component-store)
7. [NgRx Router Store](#router-store)
8. [Feature](#Feature)
9. NgRx Entity
10. NgRx Data
11. NgRx Schematics


# What NGRX fixes?
1. Hitting Unncessary API on page load.
2. Common Store of variables where variables are not tied to components by which page renders variables much faster.
3. Syncing data with backend
4. Avoid Loading of data which is already present by having in-memory database(not exactly).


# Store

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

### Simple steps:

Check example: *1_simple_root_state*

1. Create a file, specify an action app.action.ts. An action is nothing but a string.
```js
export const createUser = createAction(
“[ComponentName] Create User”
)
```
2. Create a file, specify a reducer app.reducer.ts. A reducer is where you will write your modification.

```js
// Your State Type, why it is empty because we have specified empty object in app.module.ts in StoreModule.
export interface AppState {}

export interface User {
	name: string;
}

export const initialState: AppState = {}

export const appReducer = createReducer(
	initialState,
	on(createUser, (state) => {
		return {name: ‘Deepen’};
	})
);
```

3. Dispatch An action
```js
export class AppComponent implements Oninit {

	constructor(private store: Store<AppState>) {}

	ngOninit() {
		this.store.dispatch(createUser);
	}
}
```
4. For this to work you need give StoreModule, the name of the reducer
```js
StoreModule.forRoot({‘app’: appReducer}, {})
```

If you want to pass data to it, then specify using props,
Check Example: *2_with_props*

```js
export const changeName = createAction(
    “[ComponentName] Create User”,
    props<{payload: User}>()
)
export const initialState: AppState = {}

export const appReducer = createReducer(
    initialState,
    on(changeName, (state, action) => {
        return action.payload;
    })
);
```

`state` shows value before value has been changed and `action` has data attached to it. Action has two things type and data(type is specified using parameterized props, in this case its `{payload: User}`.

Now, lets dispatch the action with data,
```js
this.store.dispatch(createUser({name: ‘Deepen’});
    ​ Listing to store
constructor(private store: Store<AppState>) {
    this.store.subscribe(e => {
        console.log(e);
    });
}
```
# Typings file for actions

**app/store/user/index.ts**
```js
import * as UserActions from './user.action';

export { UserActions };
```

You can create separate actions file beside components and use index.ts in modules like this to re-export and use across module.

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
# Feature State
Check Example: *3_feature_state*
How to keep root state empty and create feature keys. *4_feature_state_actionreducermap* also focuses on using `ActionReducerMap`.

Consider, you have empty Root object
```js
StoreModule.forRoot({}, {});
```

Now, your feature module will have something like this,
```js
StoreModule.forFeature('user', reducers);
```

Now, your state will be,
```js
{
    user: {}
}
```

Suppose you want to add predefined keys under your feature key(you can also do it for root key), then you can put it in ActionReducerMap object along with its reducers and then specify it in `StoreModule.forFeature`.

Check Example: *4_feature_state_actionreducermap*

# Multiple action on same reducer
Check Example: *4_feature_state_actionreducermap*
```js
on(increment, decrement, (state, action) => {

    // State is before mutation value
    // Action has after mutation value
    console.log("In firstReducer", state, action);

    return {
        ...state,
        num: action.num
    };
}),
```
# Selectors

Check Example: *4_feature_state_actionreducermap*

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


## Example 4

Route block with guard using ngrx state
```js
canActivate(route: ActivateRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store
        .pipe(
            select(isLoggedIn),
            tap(loggedIn => {
                if(!loggedIn) {
                    this.router.navigateByUrl('/login');
                }
            })
        )
}
```

## Example 5

Use multiple selectors to create new selector.

```js
const allItems = (state: AppState) => state.clothingItems;

const shoppingCart = (state: AppState) => state.shoppingCart;

const cartIds = createSelector(shoppingCart, cart => cart.map(item => item.id));

const clothingItems = createSelector(
  allItems,
  cartIds,
  (items, cart) => items.map(item => ({
    ...item,
    isInShoppingCart: cart.includes(item.id),
  }),
);
```

# Effects

Check Example: *5_effects*

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
    , {dispatch: false});
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
What if we want independent(clean) Root State and Dynamic state which is not hard coded. For this we use Feature State and keep root state empty object
```js
StoreModule.forRoot({}, {});
```


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

# Meta Reducers

# Entity

# Data

# Router Store

# Component Store

Component Store is nothing but a service with Observables.

**Pros:**
1. You can share data(state) between parent and child(nested).
2. Replace `@Input` and `@Output` with component-store so that parent and child can share state.

**Cons:**
1. The main problem with component store is it doesn't have actions, which means you cannot debug the redux devtools.
2. Suppose there are multiple instances of a component. Consider, you are using **ngFor** on a component, then multiple service instances would be created. Else you use ComponentStore
3. Cannot be used with `router-outlet`. Only Parent-Child.

There are two ways you can use component store:
1. Create a subclass of Component Store.

```js
export interface Movie {
  name: string;
  rating: number;
}

export interface MoviesState {
  movies: Movie[];
}

@Injectable()
export class MoviesStore extends ComponentStore<MoviesState> {

  constructor() {
    super({movies: []});
  }

}
```

```js
export class FirstComponent implements ngOninit {
  
  constructor(private movieStore: MovieStore) {
  }
  
  ngOnInit(): void {
    this.movieStore.patchState({movies: [{name: 'Avengers', rating: 9}]});
  }
}
```
Remember, here you can add *selectors* in the service file.

2. Inject ComponentStore directly in the component.
```js
export class FirstComponent implements ngOninit {
  
  constructor(private componentStore: ComponentStore<MovieState>) {
  }
  
  ngOnInit(): void {
    this.componentStore.setState({movies: [{name: 'Avengers', rating: 9}]});
  }
}
```
You have to add selectors in component as there is no service file.


























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


## What not to do in NgRx

1. Never keep derived state inside the store
```js
// reducer.ts

const _reducer = createReducer(
  initialState,
  on(clothingActions.filter, (state, {payload}) => ({
    ...state,
    query: payload,
  })),
);

// selectors.ts

const allClothings = (state: AppState) => state.clothings;

const query = (state: AppState) => state.query;

const filteredClothings = createSelector(
  allClothings,
  query,
  (clothings, query) => clothing.filter(
    clothing => clothing.name.includes(query),
  ),
);
```

2. Don't pipe the Observable selected from the store
```js
  activeUsers$ = this.store.select(state => state.users).pipe(
    map(users => users.filter(user => user.isActive)),
  );
```
Instead use
```js
const activeUsers = (state: AppState) => state.users.filter(user => user.isActive)
activeUsers$ = this.store.select(activeUsers);
```

Or use new `createSelector`
```js
const activeUsers$ = createSelector(
    state => state.users,
    (users) => users.filter(user => user.isActive)
);
```

3. Don't use combineLatest. Use named selectors instead. Check **Example 5** of selectors.

