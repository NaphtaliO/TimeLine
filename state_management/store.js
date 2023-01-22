import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import postsReducer from './postsSlice';
import feedReducer from './feedSlice';
import notificationTokenReducer from './notificationTokenSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        posts: postsReducer,
        feed: feedReducer,
        notificationToken: notificationTokenReducer
    }
})