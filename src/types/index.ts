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
  // Elenco degli id utente che hanno consigliato il post
  likes: string[];
  // Immagine opzionale del post, salvata come data URL (base64) in db.json
  image?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}
