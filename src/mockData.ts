import type { Post } from "./types";

export const mockPosts: Post[] = [
  {
    id: "p1",
    authorId: "u1",
    content: "Il mio primo post su questo clone di LinkedIn!",
    createdAt: new Date().toISOString(),
  },
];
