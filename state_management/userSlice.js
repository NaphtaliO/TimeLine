import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null,
    },
    reducers: {
        logIn: (state, action) => {
            state.value = action.payload;
        },
        logOut: (state) => {
            state.value = null;
        },
        update: (state, action) => {
            state.value = action.payload;
        },
        updateFavourites: (state, action) => {
            state.value.favourites = action.payload.favourites;
        },
        follow: (state, action) => {
            state.value.following = action.payload.following;
            state.value.followers = action.payload.followers;
        },
    },
})


// Action creators are generated for each case reducer function
export const { logIn, logOut, update, updateFavourites, follow } = userSlice.actions

export default userSlice.reducer