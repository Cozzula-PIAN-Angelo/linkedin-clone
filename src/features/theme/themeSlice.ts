import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
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
