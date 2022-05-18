import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Name, Other, User, userFeatureKey } from './user.reducers';

// Feature keys will match with that defined in StoreModule.forFeature()
export const userFeatureState = createFeatureSelector<User>(userFeatureKey);

export const nameFeatureState = createFeatureSelector<Name>('name');

export const firstname = createSelector(
    // nameFeatureState, // cannnot give inner key to search as featureselector key
    userFeatureState, // You will always get Root Store
    (state: User) => state.name.firstName,
);

export const middlename = createSelector(
    userFeatureState,
    (state: User) => state.name.middleName
);

export const lastname = createSelector(
    userFeatureState,
    (state: User) => state.name.lastName
);

// Memoized / Computed
export const firstnameLength = createSelector(
    firstname,
    (state: string) => state.length,
);

export const email = createSelector(
    userFeatureState,
    (state: User) => state.other.email
);

// Memoized / Computed
export const isAdult = createSelector(
    userFeatureState,
    (state: User) => {
        let age = state.other.age;
        return age >= 18 ? true: false;
    },
);


export const fullname = createSelector(
    userFeatureState,
    (state: User) => {

        return (state.name.firstName || '') + ' ' +(state.name.middleName || '') + ' ' +(state.name.lastName || '');
    }
);

// export const prefixname = createSelector(
//     firstname,
//     middlename,
//     lastname,
//     (f,m,l) => `${f.slice(0, 2)} ${m.slice(0, 2)} ${l.slice(0, 2)}`
// );

// Feature selector
// export const