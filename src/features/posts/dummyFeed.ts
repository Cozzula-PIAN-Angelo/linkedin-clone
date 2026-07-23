import type { Comment, Post, User } from "../../types";

// Dati finti da DummyJSON per far sembrare l'app un social "vivo".
// Tutto ciò che è finto ha un id che inizia con questo prefisso: così lo
// riconosciamo e NON lo salviamo mai in db.json (esiste solo in Redux).
export const DUMMY_PREFIX = "dummy-";

export function isDummyId(id: string | number): boolean {
  return String(id).startsWith(DUMMY_PREFIX);
}

// I commenti scritti dall'utente reale sui post finti restano anche loro solo
// in memoria: li marchiamo con questo prefisso per non mandarli al server.
export const LOCAL_PREFIX = "local-";

export function isLocalId(id: string | number): boolean {
  return String(id).startsWith(LOCAL_PREFIX);
}

export interface DummyPools {
  users: User[];
  contents: string[];
  commentTexts: string[];
}

interface DummyJsonUser {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  company: { name: string; title: string };
  address: { city: string };
}

// Scarica da DummyJSON gli utenti finti e i testi da usare per post e commenti
export async function fetchDummyPools(): Promise<DummyPools> {
  const [usersRes, postsRes, commentsRes] = await Promise.all([
    fetch(
      "https://dummyjson.com/users?limit=30&select=firstName,lastName,image,company,address"
    ),
    fetch("https://dummyjson.com/posts?limit=100&select=body"),
    fetch("https://dummyjson.com/comments?limit=100&select=body"),
  ]);

  if (!usersRes.ok || !postsRes.ok || !commentsRes.ok) {
    throw new Error("DummyJSON non raggiungibile");
  }

  const usersData: { users: DummyJsonUser[] } = await usersRes.json();
  const postsData: { posts: { body: string }[] } = await postsRes.json();
  const commentsData: { comments: { body: string }[] } = await commentsRes.json();

  const users: User[] = usersData.users.map((u) => ({
    id: `${DUMMY_PREFIX}u${u.id}`,
    email: `${u.firstName}.${u.lastName}@example.com`.toLowerCase(),
    name: u.firstName,
    surname: u.lastName,
    avatar: u.image,
    job: [],
    headline: `${u.company.title} presso ${u.company.name}`,
    location: u.address.city,
  }));

  return {
    users,
    contents: postsData.posts.map((p) => p.body),
    commentTexts: commentsData.comments.map((c) => c.body),
  };
}

// Contatore per generare id unici anche quando creiamo più elementi nello stesso millisecondo
let counter = 0;

function nextId(kind: "p" | "c"): string {
  counter += 1;
  return `${DUMMY_PREFIX}${kind}${counter}-${Date.now()}`;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Sottoinsieme casuale di utenti finti (per i like)
function randomLikers(users: User[], max: number): string[] {
  const shuffled = [...users].sort(() => Math.random() - 0.5);
  const count = Math.floor(Math.random() * (max + 1));
  return shuffled.slice(0, count).map((u) => String(u.id));
}

function randomPastDate(maxDays: number): Date {
  const maxMs = maxDays * 24 * 60 * 60 * 1000;
  // Almeno 30 minuti fa, per non sembrare tutti pubblicati "Ora"
  const offset = 30 * 60 * 1000 + Math.random() * maxMs;
  return new Date(Date.now() - offset);
}

// Un nuovo post finto pubblicato "adesso" (per l'attività live del feed):
// parte senza like, li accumulerà con l'attività successiva
export function buildDummyPost(pools: DummyPools, createdAt = new Date()): Post {
  return {
    id: nextId("p"),
    authorId: String(randomItem(pools.users).id),
    content: randomItem(pools.contents),
    createdAt: createdAt.toISOString(),
    likes: [],
  };
}

// Un commento finto su un post qualsiasi (vero o finto)
export function buildDummyComment(
  pools: DummyPools,
  postId: string,
  createdAt = new Date()
): Comment {
  return {
    id: nextId("c"),
    postId: String(postId),
    authorId: String(randomItem(pools.users).id),
    content: randomItem(pools.commentTexts),
    createdAt: createdAt.toISOString(),
  };
}

// Il mix iniziale: post finti sparsi negli ultimi giorni, con like e commenti
export function buildInitialDummyFeed(pools: DummyPools, count = 7): {
  authors: User[];
  posts: Post[];
  comments: Comment[];
} {
  const posts: Post[] = [];
  const comments: Comment[] = [];

  for (let i = 0; i < count; i++) {
    const post = buildDummyPost(pools, randomPastDate(6));
    // I post del seed sono "vecchi" di ore o giorni: hanno già raccolto like
    post.likes = randomLikers(pools.users, 12);

    const commentCount = Math.floor(Math.random() * 4);
    for (let j = 0; j < commentCount; j++) {
      // Il commento arriva dopo il post, in un momento casuale tra il post e adesso
      const postTime = new Date(post.createdAt).getTime();
      const commentTime = postTime + Math.random() * (Date.now() - postTime);
      comments.push(buildDummyComment(pools, String(post.id), new Date(commentTime)));
    }

    posts.push(post);
  }

  return { authors: pools.users, posts, comments };
}
