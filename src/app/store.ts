import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postsReducer from "../features/posts/postsSlice";
import profileReducer from "../features/profile/profileSlice";
import networkReducer from "../features/network/networkSlice";
import { newsApi } from "../features/news/newsApi";
import { jobsApi } from "../features/jobs/jobsApi";
import notificationReducer from "../features/notification/notificationSlice";
import themeReducer from "../features/theme/themeSlice";
import messagingReducer from "../../src/features/messaging/data/messagingSlice";

export const store = configureStore({
  reducer: {
    [newsApi.reducerPath]: newsApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    notification: notificationReducer,
    theme: themeReducer,
    auth: authReducer,
    posts: postsReducer,
    profile: profileReducer,
    network: networkReducer,
    messaging: messagingReducer,
    // ogni feature aggiunge la propria riga qui
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(newsApi.middleware, jobsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
