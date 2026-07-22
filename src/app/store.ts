import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { newsApi } from "../features/news/newsApi";
import notificationReducer from "../features/notification/notificationSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    [newsApi.reducerPath]: newsApi.reducer,
    notification: notificationReducer,
    theme: themeReducer,
    auth: authReducer,
    // ogni feature aggiunge la propria riga qui, es:
    // posts: postsReducer,
    // profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(newsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
