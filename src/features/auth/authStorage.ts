import type { User } from "../../types";

// Chiavi localStorage: "token" era già usata prima, "currentUser" si aggiunge
// per ricordare anche i dati dell'utente tra un refresh e l'altro.
const TOKEN_KEY = "token";
const USER_KEY = "currentUser";

export interface Session {
  token: string;
  user: User;
}

export function saveSession(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function loadSession(): Session | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  if (!token || !rawUser) return null;

  try {
    return { token, user: JSON.parse(rawUser) as User };
  } catch {
    // dato corrotto in localStorage: meglio ripartire da sloggati
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
