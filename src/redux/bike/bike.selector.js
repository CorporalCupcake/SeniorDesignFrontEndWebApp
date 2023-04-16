import { createSelector } from 'reselect'

export const selectBikeReducer = store => store.bike;

export const selectBike = createSelector(
    [selectBikeReducer],
    bike => bike.user
)