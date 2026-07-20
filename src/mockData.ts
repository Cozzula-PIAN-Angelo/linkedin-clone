import type { User, Post } from "./types";

export const mockUsers: User[] = [
  {
    id: "u1",
    email: "mario.rossi@example.com",
    password: "password123",
    name: "Mario",
    surname: "Rossi",
    avatar: "/avatars/mario.png",
    job: [{ id: "j1", title: "Frontend Developer" }],
  },
];

export const mockPosts: Post[] = [
  {
    id: "p1",
    authorId: "u1",
    content: "Il mio primo post su questo clone di LinkedIn!",
    createdAt: new Date().toISOString(),
  },
];
