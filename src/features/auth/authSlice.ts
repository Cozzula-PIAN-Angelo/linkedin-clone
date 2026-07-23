import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import type { User } from "../../types/index";

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
  isAuthenticated: boolean;
  // true finché Firebase non ha ancora risposto se c'è una sessione attiva
  // (al primo caricamento della pagina, prima che onAuthStateChanged scatti)
  initializing: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  initializing: true,
  loading: false,
  error: null,
};

async function loadUserProfile(uid: string): Promise<User> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) {
    throw new Error("Profilo utente non trovato");
  }
  return { id: uid, ...snap.data() } as User;
}

function firebaseErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Credenziali non valide";
    case "auth/email-already-in-use":
      return "Email già registrata";
    case "auth/weak-password":
      return "Password troppo debole (minimo 6 caratteri)";
    default:
      return err instanceof Error ? err.message : "Errore di connessione";
  }
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const email = credentials.email.trim().toLowerCase();
      const { user } = await signInWithEmailAndPassword(
        auth,
        email,
        credentials.password,
      );
      const profile = await loadUserProfile(user.uid);
      return profile;
    } catch (err) {
      return rejectWithValue(firebaseErrorMessage(err));
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const email = userData.email.trim().toLowerCase();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        userData.password,
      );

      const profile: User = {
        id: user.uid,
        email,
        name: userData.name,
        surname: userData.surname,
        headline: userData.headline ?? "",
        avatar: "", // Avatar.tsx mostra le iniziali quando src è vuoto/non caricabile
        job: [],
        location: "",
      };

      await setDoc(doc(db, "users", user.uid), profile);
      return profile;
    } catch (err) {
      return rejectWithValue(firebaseErrorMessage(err));
    }
  },
);

// Elimina definitivamente l'account dell'utente loggato (Auth + profilo Firestore)
export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_: void, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return rejectWithValue("Nessun utente loggato");
      }

      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      return;
    } catch (err) {
      return rejectWithValue(firebaseErrorMessage(err));
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Chiamata da onAuthStateChanged (vedi App.tsx) ogni volta che Firebase
    // scopre lo stato di login corrente: al primo avvio, al login e al logout
    authStateResolved: (state, action: { payload: User | null }) => {
      state.currentUser = action.payload;
      state.isAuthenticated = action.payload !== null;
      state.initializing = false;
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
        state.currentUser = action.payload;
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
        state.currentUser = action.payload;
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
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export const { authStateResolved, clearError } = authSlice.actions;
export default authSlice.reducer;
