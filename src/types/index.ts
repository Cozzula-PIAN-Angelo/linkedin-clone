export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  avatar: string;
  job: JobTitle[];
  headline: string; // Aggiunta per ProfileCard <- Alb
  location: string; // 8======D
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
