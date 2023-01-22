import { createSlice } from "@reduxjs/toolkit";

export const feedSlice = createSlice({
    name: "feed",
    initialState: {
        value: [],
    },
    reducers: {
        setFeed: (state, action) => {
            state.value = action.payload;
        },
        addToFeed: (state, action) => {
            state.value = [action.payload, ...state.value];
        },
        updatePostInFeed: (state, action) => {
            const index = state.value.findIndex(obj => obj._id === action.payload._id);
            state.value[index].likes = action.payload.likes;
            state.value[index].comments = action.payload.comments;
        },
        deletePostInFeed: (state, action) => {
            state.value = state.value.filter(post => post._id !== action.payload._id)
        },
    },
});

export const { setFeed, addToFeed, updatePostInFeed, deletePostInFeed } = feedSlice.actions;

export default feedSlice.reducer;
