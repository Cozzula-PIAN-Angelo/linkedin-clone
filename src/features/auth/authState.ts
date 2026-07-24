import type { User } from "../../types";

// Forma minima dello stato auth che le altre slice leggono via getState,
// senza importare RootState (che creerebbe una dipendenza circolare).
export interface StateWithAuth {
  auth: { currentUser: User | null };
}
