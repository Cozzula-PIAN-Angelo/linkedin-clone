import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { DUMMY_PREFIX, isDummyId } from "../posts/dummyFeed";
import { sendNotification } from "../notification/sendNotification";
import type { Connection, User } from "../../types";
import type { StateWithAuth } from "../auth/authState";

interface NetworkState {
  connections: Connection[];
  // Utenti reali da Firestore: servono per nomi e avatar di inviti e collegamenti
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: NetworkState = {
  connections: [],
  users: [],
  loading: false,
  error: null,
};

// Carica collegamenti e utenti reali. Firestore non sa filtrare "richieste
// dove sono mittente O destinatario" in una query sola, quindi scarichiamo
// tutte le connessioni e filtriamo noi (come già faceva json-server prima).
export const fetchNetwork = createAsyncThunk(
  "network/fetchNetwork",
  async (_: void, { rejectWithValue }) => {
    try {
      const [connectionsSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, "connections")),
        getDocs(collection(db, "users")),
      ]);

      const connections = connectionsSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Connection,
      );
      const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as User);
      return { connections, users };
    } catch {
      return rejectWithValue(
        "Impossibile raggiungere Firestore. Controlla la connessione.",
      );
    }
  }
);

// Invia una richiesta di collegamento a nome dell'utente loggato.
// Verso un utente finto resta solo in memoria, come i like sui post finti.
export const sendRequest = createAsyncThunk(
  "network/sendRequest",
  async (addresseeId: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;
      if (!auth.currentUser) {
        return rejectWithValue("Devi essere loggato per collegarti");
      }

      const body = {
        requesterId: String(auth.currentUser.id),
        addresseeId: String(addresseeId),
        status: "pending" as const,
        createdAt: new Date().toISOString(),
      };

      if (isDummyId(addresseeId)) {
        return { ...body, id: `${DUMMY_PREFIX}conn${Date.now()}` } as Connection;
      }

      const docRef = await addDoc(collection(db, "connections"), body);

      const displayName = `${auth.currentUser.name} ${auth.currentUser.surname}`;
      void sendNotification(
        addresseeId,
        String(auth.currentUser.id),
        `${displayName} vuole collegarsi con te`,
      );

      return { id: docRef.id, ...body } as Connection;
    } catch {
      return rejectWithValue("Errore durante l'invio della richiesta");
    }
  }
);

// Accetta un invito ricevuto
export const acceptRequest = createAsyncThunk(
  "network/acceptRequest",
  async (connection: Connection, { getState, rejectWithValue }) => {
    try {
      // Invito finto: si accetta solo in memoria
      if (isDummyId(connection.id)) {
        return { ...connection, status: "accepted" as const };
      }

      await updateDoc(doc(db, "connections", connection.id), {
        status: "accepted",
      });

      // Notifica chi aveva inviato la richiesta
      const { auth } = getState() as StateWithAuth;
      if (auth.currentUser) {
        const displayName = `${auth.currentUser.name} ${auth.currentUser.surname}`;
        void sendNotification(
          connection.requesterId,
          String(auth.currentUser.id),
          `${displayName} ha accettato il tuo invito di collegamento`,
        );
      }

      return { ...connection, status: "accepted" as const };
    } catch {
      return rejectWithValue("Errore durante l'accettazione dell'invito");
    }
  }
);

// Ignora un invito, ritira una richiesta inviata o rimuove un collegamento
export const removeConnection = createAsyncThunk(
  "network/removeConnection",
  async (connectionId: string, { rejectWithValue }) => {
    try {
      // Connessione finta: esiste solo in memoria
      if (isDummyId(connectionId)) {
        return connectionId;
      }

      await deleteDoc(doc(db, "connections", connectionId));
      return connectionId;
    } catch {
      return rejectWithValue("Errore durante la rimozione");
    }
  }
);

export const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    clearNetworkError: (state) => {
      state.error = null;
    },
    // Inviti finti in arrivo, seminati una volta sola (guardia anti-StrictMode)
    dummyInvitesSeeded: (state, action: PayloadAction<Connection[]>) => {
      if (state.connections.some((c) => isDummyId(c.id))) return;
      state.connections.push(...action.payload);
    },
    // Un utente finto accetta la richiesta che gli avevamo inviato
    dummyRequestAccepted: (state, action: PayloadAction<string>) => {
      const connection = state.connections.find((c) => c.id === action.payload);
      if (connection) connection.status = "accepted";
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchNetwork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNetwork.fulfilled, (state, action) => {
        state.loading = false;
        // Firestore conosce solo le connessioni vere: quelle finte vanno preservate
        const dummyConnections = state.connections.filter((c) => isDummyId(c.id));
        state.connections = [...action.payload.connections, ...dummyConnections];
        state.users = action.payload.users;
      })
      .addCase(fetchNetwork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // SEND
      .addCase(sendRequest.fulfilled, (state, action) => {
        state.connections.push(action.payload);
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // ACCEPT
      .addCase(acceptRequest.fulfilled, (state, action) => {
        const index = state.connections.findIndex(
          (c) => String(c.id) === String(action.payload.id)
        );
        if (index !== -1) state.connections[index] = action.payload;
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // REMOVE
      .addCase(removeConnection.fulfilled, (state, action) => {
        state.connections = state.connections.filter(
          (c) => String(c.id) !== String(action.payload)
        );
      })
      .addCase(removeConnection.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Vero se la connessione coinvolge l'utente indicato (come mittente o destinatario)
export function involvesUser(connection: Connection, userId: string): boolean {
  return (
    String(connection.requesterId) === String(userId) ||
    String(connection.addresseeId) === String(userId)
  );
}

export const { clearNetworkError, dummyInvitesSeeded, dummyRequestAccepted } =
  networkSlice.actions;
export default networkSlice.reducer;
