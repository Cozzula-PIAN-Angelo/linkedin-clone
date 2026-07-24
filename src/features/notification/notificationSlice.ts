import {
  createAsyncThunk,
  createSlice,
  nanoid,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import type { NotificationItem } from "./types";
import { mockNotifications } from "./notificationsData";

interface NotificationState {
  items: NotificationItem[];
}

const initialState: NotificationState = {
  items: mockNotifications,
};

// Le notifiche finte (attività dummy) esistono solo in Redux, mai su
// Firestore: le riconosciamo da questo prefisso, generato dal "prepare"
// di addNotification qui sotto.
const LOCAL_NOTIFICATION_PREFIX = "local-n";

function isLocalNotification(id: string): boolean {
  return id.startsWith(LOCAL_NOTIFICATION_PREFIX);
}

// Cancella una notifica: se è reale (arrivata da Firestore tramite il
// listener) la cancella anche lì, altrimenti al prossimo snapshot
// ricomparirebbe. Se è finta (dummy) esiste solo in Redux: niente da fare.
export const removeNotification = createAsyncThunk(
  "notifications/removeNotification",
  async (id: string) => {
    if (!isLocalNotification(id)) {
      await deleteDoc(doc(db, "notifications", id));
    }
    return id;
  },
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Nuova notifica finta in cima alla campanella; il prepare costruisce
    // l'item (id e data non si generano nel reducer, deve restare puro).
    addNotification: {
      reducer: (state, action: PayloadAction<NotificationItem>) => {
        state.items.unshift(action.payload);
      },
      prepare: (message: string) => ({
        payload: {
          id: `${LOCAL_NOTIFICATION_PREFIX}${nanoid()}`,
          message,
          time: "Ora",
          read: false,
        },
      }),
    },
    // Sostituisce le notifiche reali con l'ultimo snapshot di Firestore
    // ricevuto dal listener realtime; quelle finte (dummy) restano intatte.
    notificationsSynced: (
      state,
      action: PayloadAction<NotificationItem[]>,
    ) => {
      const localOnes = state.items.filter((n) => isLocalNotification(n.id));
      state.items = [...action.payload, ...localOnes];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeNotification.fulfilled, (state, action) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    });
  },
});

export const { addNotification, notificationsSynced } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
