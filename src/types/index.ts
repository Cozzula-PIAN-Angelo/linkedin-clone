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
  /* l'interfaccia deve essere così come vedi questa Cri
    id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  */
}

// Esperienza lavorativa mostrata nel profilo, salvata su db.json
export interface Experience {
  id: string;
  userId: string;
  role: string;
  company: string;
  period: string;
  description: string;
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

// Richiesta di collegamento: nasce "pending" e diventa "accepted".
// Quelle verso gli utenti finti hanno id "dummy-" e vivono solo in memoria.
export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: "pending" | "accepted";
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}
