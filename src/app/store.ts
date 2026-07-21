import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // ogni feature aggiunge la propria riga qui, es:
    // auth: authReducer,
    // posts: postsReducer,
    // profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
