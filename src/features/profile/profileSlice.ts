import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import type { Experience, User } from "../../types";
import type { StateWithAuth } from "../auth/authState";

export interface UpdateProfilePayload {
  name: string;
  surname: string;
  headline: string;
  // Data URL della nuova foto: assente se l'utente non l'ha cambiata
  avatar?: string;
}

// Il form manda i campi compilati, userId e id li mettono la thunk e Firestore
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

// Salva le modifiche al profilo dell'utente loggato su Firestore.
// authSlice ascolta il fulfilled per aggiornare currentUser.
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (changes: UpdateProfilePayload, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;
      if (!auth.currentUser) {
        return rejectWithValue("Nessun utente loggato");
      }

      await updateDoc(doc(db, "users", auth.currentUser.id), { ...changes });
      return { ...auth.currentUser, ...changes } as User;
    } catch {
      return rejectWithValue("Errore durante il salvataggio del profilo");
    }
  }
);

// Carica le esperienze del profilo aperto. Gli utenti finti (id "dummy-")
// non esistono su Firestore: la query restituisce semplicemente una lista vuota.
export const fetchExperiences = createAsyncThunk(
  "profile/fetchExperiences",
  async (userId: string, { rejectWithValue }) => {
    try {
      const snap = await getDocs(
        query(collection(db, "experiences"), where("userId", "==", userId)),
      );
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Experience);
    } catch {
      return rejectWithValue("Errore durante il caricamento delle esperienze");
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

      const body = { ...experience, userId: String(auth.currentUser.id) };
      const docRef = await addDoc(collection(db, "experiences"), body);
      return { id: docRef.id, ...body } as Experience;
    } catch {
      return rejectWithValue("Errore durante il salvataggio dell'esperienza");
    }
  }
);

export const deleteExperience = createAsyncThunk(
  "profile/deleteExperience",
  async (experienceId: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "experiences", experienceId));
      return experienceId;
    } catch {
      return rejectWithValue("Errore durante l'eliminazione dell'esperienza");
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
