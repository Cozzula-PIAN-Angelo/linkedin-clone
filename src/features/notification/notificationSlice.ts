import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NotificationItem } from "./types";
import { mockNotifications } from "./notificationsData";

interface NotificationState {
  items: NotificationItem[];
}

const initialState: NotificationState = {
  items: mockNotifications,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    // Nuova notifica in cima alla campanella; il prepare costruisce l'item
    // (id e data non si generano nel reducer, deve restare puro)
    addNotification: {
      reducer: (state, action: PayloadAction<NotificationItem>) => {
        state.items.unshift(action.payload);
      },
      prepare: (message: string) => ({
        payload: {
          id: `local-n${Date.now()}`,
          message,
          time: "Ora",
          read: false,
        },
      }),
    },
  },
});

export const { removeNotification, addNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
