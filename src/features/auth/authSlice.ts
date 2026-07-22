import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "../../types/index";

// Tipi per i dati di Input
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  surname: string;
  title?: string;
}

interface AuthState {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

// prima thunk asincrona per accedere , va usatala porta 3000 ogin che è un endpoint di json auth
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      // 🟢 USIAMO /login AL POSTO DI /users!
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se le credenziali sono sbagliate, restituisce l'errore
        return rejectWithValue(typeof data === "string" ? data : "Credenziali non valide");
      }

      // salva il token nel localstorage
      localStorage.setItem("token", data.accessToken);
      return data; // Contiene accessToken e dati user
    } catch (err: any) {
      return rejectWithValue(err.message || "Errore di connessione");
    }
  }
);
// seconda thunk asincrona su json server , per registrarsi
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data || "Errore durante la registrazione");
      }

      localStorage.setItem("token", data.accessToken);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Errore di connessione");
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
      localStorage.removeItem("token");
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
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
