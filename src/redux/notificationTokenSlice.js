import { createSlice } from "@reduxjs/toolkit";

//This is for setting the notification token globally
//So I can access it anywhere

export const notificationTokenSlice = createSlice({
    name: "notificationToken",
    initialState: {
        value: "",
    },
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { setToken } = notificationTokenSlice.actions;

export default notificationTokenSlice.reducer;