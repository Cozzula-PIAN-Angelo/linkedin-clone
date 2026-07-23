import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { isDummyId, isLocalId, LOCAL_PREFIX } from "./dummyFeed";
import type { Comment, Post, User } from "../../types";

const API_URL = "http://localhost:3000";

// Ordina i post dal più recente al più vecchio
function byDateDesc(a: Post, b: Post): number {
  return b.createdAt.localeCompare(a.createdAt);
}

interface PostsState {
  items: Post[];
  // Gli autori dei post: servono per mostrare nome, headline e avatar nelle card
  authors: User[];
  comments: Comment[];
  loading: boolean;
  posting: boolean;
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  authors: [],
  comments: [],
  loading: false,
  posting: false,
  error: null,
};

// Stato minimo che le thunk leggono dallo store (evita di importare RootState creando un ciclo)
interface StateWithAuth {
  auth: { currentUser: User | null; token: string | null };
}

// Carica il feed: i post (dal più recente), gli utenti per gli autori e i commenti
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_: void, { rejectWithValue }) => {
    try {
      const [postsRes, usersRes, commentsRes] = await Promise.all([
        fetch(`${API_URL}/posts?_sort=createdAt&_order=desc`),
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/comments?_sort=createdAt&_order=asc`),
      ]);

      if (!postsRes.ok || !usersRes.ok || !commentsRes.ok) {
        return rejectWithValue("Errore durante il caricamento del feed");
      }

      const posts: Post[] = await postsRes.json();
      const authors: User[] = await usersRes.json();
      const comments: Comment[] = await commentsRes.json();
      return { posts, authors, comments };
    } catch {
      return rejectWithValue(
        "Impossibile raggiungere il server. Avvialo con: npm run server"
      );
    }
  }
);

export interface NewPostPayload {
  content: string;
  // Data URL dell'immagine allegata (opzionale)
  image?: string;
}

// Pubblica un nuovo post a nome dell'utente loggato
export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ content, image }: NewPostPayload, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;
      if (!auth.currentUser) {
        return rejectWithValue("Devi essere loggato per pubblicare");
      }

      const body = {
        authorId: String(auth.currentUser.id),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        likes: [],
        ...(image ? { image } : {}),
      };

      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante la pubblicazione del post");
      }

      const post: Post = await response.json();
      return post;
    } catch {
      return rejectWithValue("Errore di connessione al server");
    }
  }
);

// Aggiunge o toglie il "Consiglia" dell'utente loggato su un post
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (post: Post, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;
      if (!auth.currentUser) {
        return rejectWithValue("Devi essere loggato per consigliare");
      }

      const userId = String(auth.currentUser.id);
      const likes = post.likes.includes(userId)
        ? post.likes.filter((id) => id !== userId)
        : [...post.likes, userId];

      // Post finto: il like resta solo in memoria, niente chiamata al server
      if (isDummyId(post.id)) {
        return { ...post, likes };
      }

      // Post vero: in db.json salviamo solo i like degli utenti reali,
      // quelli finti restano solo in memoria
      const response = await fetch(`${API_URL}/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ likes: likes.filter((id) => !isDummyId(id)) }),
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante l'aggiornamento del like");
      }

      const updated: Post = await response.json();
      return { ...updated, likes };
    } catch {
      return rejectWithValue("Errore di connessione al server");
    }
  }
);

// Elimina un post (solo il proprio: il bottone compare solo sui post dell'utente loggato)
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;

      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante l'eliminazione del post");
      }

      // Elimina anche i commenti del post, così non restano orfani in db.json
      const commentsRes = await fetch(`${API_URL}/comments?postId=${postId}`);
      if (commentsRes.ok) {
        const comments: Comment[] = await commentsRes.json();
        await Promise.all(
          comments.map((comment) =>
            fetch(`${API_URL}/comments/${comment.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${auth.token}` },
            })
          )
        );
      }

      return postId;
    } catch {
      return rejectWithValue("Errore di connessione al server");
    }
  }
);

export interface NewCommentPayload {
  postId: string;
  content: string;
}

// Aggiunge un commento a un post, a nome dell'utente loggato
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, content }: NewCommentPayload, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;
      if (!auth.currentUser) {
        return rejectWithValue("Devi essere loggato per commentare");
      }

      const body = {
        postId: String(postId),
        authorId: String(auth.currentUser.id),
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      // Commento su un post finto: resta solo in memoria, niente server
      if (isDummyId(postId)) {
        return { ...body, id: `${LOCAL_PREFIX}c-${Date.now()}` } as Comment;
      }

      const response = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante la pubblicazione del commento");
      }

      const comment: Comment = await response.json();
      return comment;
    } catch {
      return rejectWithValue("Errore di connessione al server");
    }
  }
);

// Elimina un commento (solo il proprio)
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async (commentId: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as StateWithAuth;

      // Commento solo in memoria (scritto su un post finto): niente server
      if (isLocalId(commentId) || isDummyId(commentId)) {
        return commentId;
      }

      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (!response.ok) {
        return rejectWithValue("Errore durante l'eliminazione del commento");
      }

      return commentId;
    } catch {
      return rejectWithValue("Errore di connessione al server");
    }
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPostsError: (state) => {
      state.error = null;
    },
    // Inserisce il mix iniziale di contenuti finti (utenti, post e commenti da DummyJSON)
    seedDummyFeed: (
      state,
      action: PayloadAction<{ authors: User[]; posts: Post[]; comments: Comment[] }>
    ) => {
      // Già seminato (es. doppio mount in StrictMode): non duplicare
      if (state.authors.some((u) => isDummyId(u.id))) return;
      state.authors.push(...action.payload.authors);
      state.items = [...state.items, ...action.payload.posts].sort(byDateDesc);
      state.comments.push(...action.payload.comments);
    },
    // Un utente finto "pubblica" un nuovo post in cima al feed
    dummyPostArrived: (state, action: PayloadAction<Post>) => {
      state.items.unshift(action.payload);
    },
    // Un utente finto mette "Consiglia" a un post del feed
    dummyLikeArrived: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      const post = state.items.find(
        (p) => String(p.id) === String(action.payload.postId)
      );
      if (post && !post.likes.includes(action.payload.userId)) {
        post.likes.push(action.payload.userId);
      }
    },
    // Un utente finto commenta un post del feed
    dummyCommentArrived: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH FEED
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        // Il server conosce solo i dati veri: i contenuti finti già in memoria
        // vanno preservati, altrimenti un ricaricamento li farebbe sparire
        const dummyPosts = state.items.filter((p) => isDummyId(p.id));
        const dummyAuthors = state.authors.filter((u) => isDummyId(u.id));
        const memoryComments = state.comments.filter(
          (c) => isDummyId(c.id) || isLocalId(c.id)
        );
        state.items = [...action.payload.posts, ...dummyPosts].sort(byDateDesc);
        state.authors = [...action.payload.authors, ...dummyAuthors];
        state.comments = [...action.payload.comments, ...memoryComments];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CREATE
      .addCase(createPost.pending, (state) => {
        state.posting = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posting = false;
        // Il nuovo post va in cima al feed, come su LinkedIn
        state.items.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.posting = false;
        state.error = action.payload as string;
      })
      // LIKE
      .addCase(toggleLike.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => String(p.id) === String(action.payload.id)
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      // DELETE
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (p) => String(p.id) !== String(action.payload)
        );
        state.comments = state.comments.filter(
          (c) => String(c.postId) !== String(action.payload)
        );
      })
      // COMMENTS
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (c) => String(c.id) !== String(action.payload)
        );
      });
  },
});

export const {
  clearPostsError,
  seedDummyFeed,
  dummyPostArrived,
  dummyLikeArrived,
  dummyCommentArrived,
} = postsSlice.actions;
export default postsSlice.reducer;
