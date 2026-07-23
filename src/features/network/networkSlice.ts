import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DUMMY_PREFIX, isDummyId } from "../posts/dummyFeed";
import type { Connection, User } from "../../types";

const API_URL = "http://localhost:3000";

// Stato minimo che le thunk leggono dallo store (evita di importare RootState creando un ciclo)
interface StateWithAuth {
  auth: { currentUser: User | null; token: string | null };
}

interface NetworkState {
  connections: Connection[];
  // Utenti reali da db.json: servono per nomi e avatar di inviti e collegamenti
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

// Carica collegamenti e utenti reali. json-server non sa filtrare "richieste
// dove sono mittente O destinatario", quindi scarichiamo tutto e filtriamo noi.
export const fetchNetwork = createAsyncThunk(
  "network/fetchNetwork",
  async (_: void, { rejectWithValue }) => {
    try {
      const [connectionsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/connections`),
        fetch(`${API_URL}/users`),
      ]);

      if (!connectionsRes.ok || !usersRes.ok) {
        return rejectWithValue("Errore durante il caricamento della rete");
      }

      const connections: Connection[] = await connectionsRes.json();
      const users: User[] = await usersRes.json();
      return { connections, users };
    } catch {
      return rejectWithValue(
        "Impossibile raggiungere il server. Avvialo con: npm run server"
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

      const response = await fetch(`${API_URL}/connections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante l'invio della richiesta");
      }

      const connection: Connection = await response.json();
      return connection;
    } catch {
      return rejectWithValue("Errore di connessione al server");
    }
  }
);

// Accetta un invito ricevuto
export const acceptRequest = createAsyncThunk(
  "network/acceptRequest",
  async (connection: Connection, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;

      // Invito finto: si accetta solo in memoria
      if (isDummyId(connection.id)) {
        return { ...connection, status: "accepted" as const };
      }

      const response = await fetch(`${API_URL}/connections/${connection.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante l'accettazione dell'invito");
      }

      const updated: Connection = await response.json();
      return updated;
    } catch {
      return rejectWithValue("Errore di connessione al server");
    }
  }
);

// Ignora un invito, ritira una richiesta inviata o rimuove un collegamento
export const removeConnection = createAsyncThunk(
  "network/removeConnection",
  async (connectionId: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;

      // Connessione finta: esiste solo in memoria
      if (isDummyId(connectionId)) {
        return connectionId;
      }

      const response = await fetch(`${API_URL}/connections/${connectionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante la rimozione");
      }

      return connectionId;
    } catch {
      return rejectWithValue("Errore di connessione al server");
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
        // Il server conosce solo le connessioni vere: quelle finte vanno preservate
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
