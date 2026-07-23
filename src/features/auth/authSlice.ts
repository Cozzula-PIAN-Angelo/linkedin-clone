import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "../../types/index";
import { saveSession, loadSession, clearSession } from "./authStorage";
import { updateProfile } from "../profile/profileSlice";

const API_URL = "http://localhost:3000";

// Tipi per i dati di Input
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  surname: string;
  headline?: string;
}

interface AuthState {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Ripristina l'intera sessione (token + dati utente) dal localStorage:
// così dopo un refresh l'utente resta loggato E l'app sa ancora chi è.
const session = loadSession();

const initialState: AuthState = {
  currentUser: session?.user ?? null,
  token: session?.token ?? null,
  isAuthenticated: session !== null,
  loading: false,
  error: null,
};

// prima thunk asincrona per accedere , va usatala porta 3000 ogin che è un endpoint di json auth
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      // 🟢 USIAMO /login AL POSTO DI /users!
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...credentials,
          email: credentials.email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se le credenziali sono sbagliate, restituisce l'errore
        return rejectWithValue(typeof data === "string" ? data : "Credenziali non valide");
      }

      // salva l'intera sessione (token + utente) nel localStorage
      saveSession(data.accessToken, data.user);
      return data; // Contiene accessToken e dati user
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore di connessione";
      return rejectWithValue(message);
    }
  }
);
// seconda thunk asincrona su json server , per registrarsi
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      // Completa i campi richiesti dal tipo condiviso User ma non raccolti dal form di registrazione
      const body = {
        ...userData,
        email: userData.email.trim().toLowerCase(),
        headline: userData.headline ?? "",
        avatar: "", // Avatar.tsx mostra le iniziali quando src è vuoto/non caricabile
        job: [],
        location: "",
      };

      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data || "Errore durante la registrazione");
      }

      saveSession(data.accessToken, data.user);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore di connessione";
      return rejectWithValue(message);
    }
  },
);

// terza thunk: elimina definitivamente l'account dell'utente loggato da db.json
export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_: void, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const user = state.auth.currentUser;
      const token = state.auth.token;

      if (!user) {
        return rejectWithValue("Nessun utente loggato");
      }

      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante l'eliminazione dell'account");
      }

      return;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore di connessione";
      return rejectWithValue(message);
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      clearSession();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.currentUser = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.currentUser = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // DELETE ACCOUNT
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        // account eliminato dal server: la sessione locale non ha più senso
        state.loading = false;
        state.currentUser = null;
        state.token = null;
        state.isAuthenticated = false;
        clearSession();
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // UPDATE PROFILE (thunk in features/profile): currentUser resta qui
      // l'unica fonte di verità, quindi va aggiornato insieme alla sessione
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        if (state.token) {
          saveSession(state.token, action.payload);
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
