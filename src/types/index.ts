export interface User {
  id: string;
  email: string;
  // Opzionale: il backend non restituisce mai la password al frontend
  // (esiste solo in db.json, hashata). Serve solo in fase di registrazione.
  password?: string;
  name: string;
  surname: string;
  avatar: string;
  job: JobTitle[];
  headline: string; // Aggiunta per ProfileCard <- Alb
  location: string;
}

export interface JobTitle {
  id: string;
  title: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}
