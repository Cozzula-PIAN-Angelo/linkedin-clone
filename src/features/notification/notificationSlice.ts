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
  },
});

export const { removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
