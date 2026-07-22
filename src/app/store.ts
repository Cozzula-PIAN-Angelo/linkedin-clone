import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    // ogni feature aggiunge la propria riga qui, es:
    auth: authReducer,
    // posts: postsReducer,
    // profile: profileReducer,
    // home: homeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
