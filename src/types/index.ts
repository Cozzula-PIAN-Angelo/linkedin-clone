export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  avatar: string;
  job: JobTitle[];
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

export interface Post {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}
