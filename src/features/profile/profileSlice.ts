import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "../../types";

const API_URL = "http://localhost:3000";

// Stato minimo che la thunk legge dallo store (evita di importare RootState creando un ciclo)
interface StateWithAuth {
  auth: { currentUser: User | null; token: string | null };
}

export interface UpdateProfilePayload {
  name: string;
  surname: string;
  headline: string;
}

interface ProfileState {
  saving: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  saving: false,
  error: null,
};

// Salva le modifiche al profilo dell'utente loggato su db.json.
// authSlice ascolta il fulfilled per aggiornare currentUser e la sessione.
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (changes: UpdateProfilePayload, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;
      if (!auth.currentUser) {
        return rejectWithValue("Nessun utente loggato");
      }

      const response = await fetch(`${API_URL}/users/${auth.currentUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(changes),
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante il salvataggio del profilo");
      }

      // PATCH su /users restituisce il record completo, hash della password incluso:
      // lo togliamo prima che finisca in currentUser e nel localStorage
      const { password: _password, ...user } = (await response.json()) as User;
      return user as User;
    } catch {
      return rejectWithValue("Errore di connessione al server");
    }
  }
);

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
