import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Experience, User } from "../../types";

const API_URL = "http://localhost:3000";

// Stato minimo che la thunk legge dallo store (evita di importare RootState creando un ciclo)
interface StateWithAuth {
  auth: { currentUser: User | null; token: string | null };
}

export interface UpdateProfilePayload {
  name: string;
  surname: string;
  headline: string;
  // Data URL della nuova foto: assente se l'utente non l'ha cambiata
  avatar?: string;
}

// Il form manda i campi compilati, userId e id li mettono la thunk e il server
export type NewExperience = Omit<Experience, "id" | "userId">;

interface ProfileState {
  saving: boolean;
  error: string | null;
  // Esperienze del profilo attualmente aperto (non per forza il proprio)
  experiences: Experience[];
  loadingExperiences: boolean;
}

const initialState: ProfileState = {
  saving: false,
  error: null,
  experiences: [],
  loadingExperiences: false,
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

// Carica le esperienze del profilo aperto. Gli utenti finti (id "dummy-")
// non esistono su db.json: il server risponde con una lista vuota.
export const fetchExperiences = createAsyncThunk(
  "profile/fetchExperiences",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/experiences?userId=${userId}`);
      if (!response.ok) {
        return rejectWithValue("Errore durante il caricamento delle esperienze");
      }
      return (await response.json()) as Experience[];
    } catch {
      return rejectWithValue("Errore di connessione al server");
    }
  }
);

export const addExperience = createAsyncThunk(
  "profile/addExperience",
  async (experience: NewExperience, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;
      if (!auth.currentUser) {
        return rejectWithValue("Nessun utente loggato");
      }

      const response = await fetch(`${API_URL}/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          ...experience,
          userId: String(auth.currentUser.id),
        }),
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante il salvataggio dell'esperienza");
      }

      return (await response.json()) as Experience;
    } catch {
      return rejectWithValue("Errore di connessione al server");
    }
  }
);

export const deleteExperience = createAsyncThunk(
  "profile/deleteExperience",
  async (experienceId: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;

      const response = await fetch(`${API_URL}/experiences/${experienceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante l'eliminazione dell'esperienza");
      }

      return experienceId;
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
      })
      // ESPERIENZE
      .addCase(fetchExperiences.pending, (state) => {
        state.loadingExperiences = true;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.loadingExperiences = false;
        state.experiences = action.payload;
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.loadingExperiences = false;
        state.error = action.payload as string;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.experiences.push(action.payload);
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.experiences = state.experiences.filter(
          (exp) => String(exp.id) !== String(action.payload)
        );
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
