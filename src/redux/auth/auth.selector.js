import { createSelector } from 'reselect'

export const selectAuthReducer = store => store.auth;

export const selectUser = createSelector(
    [selectAuthReducer],
    auth => auth.user
)