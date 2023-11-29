import { createSlice } from "@reduxjs/toolkit";

export const postsSlice = createSlice({
    name: "posts",
    initialState: {
        value: [],
    },
    reducers: {
        setPosts: (state, action) => {
            state.value = action.payload;
        },
        createPosts: (state, action) => {
            state.value = [action.payload, ...state.value];
        },
        updatePost: (state, action) => {
            const index = state.value.findIndex(obj => obj._id === action.payload._id);
            state.value[index] = action.payload;
        },
        deletePost: (state, action) => {
            state.value = state.value.filter(post => post._id !== action.payload._id)
        },
    },
});

export const { setPosts, createPosts, updatePost, deletePost } = postsSlice.actions;

export default postsSlice.reducer;
