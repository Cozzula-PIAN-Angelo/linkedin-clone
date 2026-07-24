import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { brandThemes } from "./themeConfig";
import type { BrandTheme } from "./themeConfig";

type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  brandTheme: BrandTheme;
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem("theme");
  return saved === "dark" ? "dark" : "light";
};

const getInitialBrandTheme = (): BrandTheme => {
  const saved = localStorage.getItem("brandTheme");
  return brandThemes.includes(saved as BrandTheme)
    ? (saved as BrandTheme)
    : "default";
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
  brandTheme: getInitialBrandTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
    setBrandTheme: (state, action: PayloadAction<BrandTheme>) => {
      state.brandTheme = action.payload;
      localStorage.setItem("brandTheme", action.payload);
    },
  },
});

export const { toggleTheme, setBrandTheme } = themeSlice.actions;
export default themeSlice.reducer;

// Cambia il tema localmente e, se l'utente è loggato, lo salva anche sul suo
// profilo Firestore: così al prossimo login (anche da un altro dispositivo)
// ritrova lo stesso tema invece di ripartire da "default".
export const setBrandThemeForUser = createAsyncThunk(
  "theme/setBrandThemeForUser",
  async (
    { theme, uid }: { theme: BrandTheme; uid: string | null },
    { dispatch },
  ) => {
    dispatch(setBrandTheme(theme));
    if (uid) {
      await updateDoc(doc(db, "users", uid), { brandTheme: theme });
    }
  },
);
