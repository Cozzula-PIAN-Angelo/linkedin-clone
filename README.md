# LinkedIn Clone 🔗

Un clone di **LinkedIn** costruito come progetto di gruppo (Epicode).
Front-end in **React + TypeScript** (con Vite), stato gestito con **Redux Toolkit**,
e **Firebase** come backend (database, accesso e archiviazione file).

> Vuoi capire l'app nel dettaglio, file per file? C'è la **Guida completa** in PDF
> con anche i puntatori al codice. Questo README è la versione veloce. 😊

---

## 🚀 Come si avvia

```bash
npm install        # installa le dipendenze
npm run dev        # avvia l'app su http://localhost:5173
```

Serve un file **`.env`** nella cartella del progetto con le chiavi (senza, l'app
parte ma non legge i dati / la chat non risponde):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GROQ_API_KEY=...        # per la chat AI
VITE_NEWSDATA_API_KEY=...    # per le notizie
```

Non serve nessun backend locale: è tutto su Firebase.

---

## ✨ Cosa si può fare (le funzioni principali)

- **🔐 Accedere e registrarsi** — con email e password, tramite Firebase Auth.
  La sessione resta anche dopo un refresh.
  _`features/auth/authSlice.ts` → `loginUser`, `registerUser`_

- **👤 Profilo** — il tuo e quello degli altri (stessa pagina, cambia l'URL).
  Puoi modificare nome, titolo e **foto**, e aggiungere le tue **esperienze** lavorative.
  _`features/profile/profileSlice.ts` → `updateProfile`, `addExperience`_

- **📝 Feed e post** — pubblica testo, **foto** e **video**; metti "Consiglia",
  commenta, **diffondi** (repost) e **invia** (condividi il link del post).
  _`features/posts/postsSlice.ts` → `createPost`, `toggleLike`, `addComment`, `repostPost`_

- **🤝 La mia rete** — invia richieste di collegamento, accettale o rifiutale,
  guarda i suggerimenti.
  _`features/network/networkSlice.ts` → `sendRequest`, `acceptRequest`, `removeConnection`_

- **🔔 Notifiche in tempo reale** — like, commenti e inviti arrivano subito sulla
  campanella, senza ricaricare la pagina.
  _`features/notification/useNotificationsListener.ts` + `sendNotification.ts`_

- **🔎 Ricerca** — cerca le persone dalla barra in alto e vai al loro profilo.
  _`components/navbar/Searchbar.tsx`_

- **💬 Chat AI** — tre contatti (Pippo, Pluta, Paperino) che rispondono davvero,
  grazie a un modello di intelligenza artificiale (Groq / Llama 3).
  _`features/messaging/data/messagingSlice.ts` → `fetchAIReply`_

- **💼 Lavoro e 📰 Notizie** — offerte di lavoro reali (API Remotive) e notizie
  (API NewsData).
  _`features/jobs/jobsApi.ts`, `features/news/newsApi.ts`_

- **🎨 Temi** — modalità **chiara/scura** più **5 temi a sorpresa**
  (default, villain, fantasy, cyberpunk, horror). Si sbloccano con **5 click sul logo**!
  _`features/theme/`_

> Per rendere l'app "viva" anche in pochi, ci sono utenti e post **finti** presi da
> DummyJSON: hanno un id che inizia con `dummy-` e non vengono mai salvati sul database.

---

## 🧱 Com'è fatto (stack)

| Cosa | Strumento |
|------|-----------|
| Interfaccia | React + TypeScript |
| Build / dev server | Vite |
| Stato globale | Redux Toolkit (+ RTK Query per news e lavori) |
| Navigazione | React Router |
| Grafica | React-Bootstrap |
| Backend | Firebase — Firestore (dati), Auth (accesso), Storage (video) |

---

## 📁 Struttura del progetto

```
src/
├─ app/          → store Redux e hook
├─ pages/        → le pagine (Home, Login, Network, Post, Messaging…)
├─ features/     → una cartella per funzionalità:
│  ├─ auth/          accesso
│  ├─ posts/         feed e post
│  ├─ profile/       profilo ed esperienze
│  ├─ network/       collegamenti
│  ├─ notification/  notifiche
│  ├─ messaging/     chat AI
│  ├─ jobs/          offerte di lavoro
│  ├─ news/          notizie
│  └─ theme/         temi ed effetti
├─ components/   → pezzi condivisi (Navbar, Avatar, ProfileCard…)
└─ types/        → i tipi condivisi (User, Post, Connection…)
```

---

## 📜 Comandi utili

```bash
npm run dev      # sviluppo
npm run build    # build di produzione
npm run lint     # controllo del codice
```

---

## ⚠️ Buono a sapersi

- Le **regole di Firestore** (`firestore.rules`) e **Storage** vanno **deployate** su
  Firebase, altrimenti alcune scritture (es. esperienze, upload video) possono fallire.
- I **contenuti finti** (dummy) vivono solo in memoria: spariscono a ogni refresh.
- Chi aggiorna il progetto da git deve rifare **`npm install`** se sono cambiate le dipendenze.

---

_Progetto di gruppo — Epicode Full Stack. Buon divertimento! 🎉_
