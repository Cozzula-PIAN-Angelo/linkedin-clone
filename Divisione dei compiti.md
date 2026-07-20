# LinkedIn Clone — Contesto di progetto

Progetto settimanale di gruppo (5 studenti Epicode, corso accelerato full-stack).
Clone di LinkedIn in **React + TypeScript + Redux Toolkit**, senza backend.
Obiettivo: consegnare i requisiti minimi ed essere facilmente estendibile dopo la consegna.

## Stack

- Vite (template react-ts)
- Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) — NON Redux vanilla
- react-router-dom
- Persistenza: localStorage (niente backend)

## Requisiti minimi (consegna)

1. **Login** funzionante senza backend (validazione mock, persistenza in localStorage, refresh non deve sloggare)
2. **Home**: navbar fissa (link Home, Profilo con avatar + nome e cognome, tasto Logout); feed post al centro con CRUD completo (aggiungi, modifica, elimina); riquadro sinistro con profilo utente (immagine, nome, ruolo/descrizione); riquadro destro placeholder per future notizie di lavoro
3. **Pagina profilo**: immagine, nome, cognome, elenco di tutti i ruoli; tasto per aggiungere un nuovo ruolo

## Struttura del progetto (feature-based)

```
src/
├── app/            # store.ts (configureStore), hooks.ts (useAppDispatch/useAppSelector tipizzati)
├── features/
│   ├── auth/       # authSlice, LoginPage, ProtectedRoute
│   ├── posts/      # postsSlice, PostFeed, PostCard, PostForm
│   └── profile/    # profileSlice, ProfilePage, RoleForm
├── components/     # Navbar, ProfileCard (riquadro sx), NewsPlaceholder (riquadro dx)
├── types/          # index.ts — interfacce condivise User, Post, Role
└── pages/          # HomePage + routing
```

Nuove feature post-consegna → nuova cartella in `features/`, senza toccare il resto.

## Regole sui file condivisi (IMPORTANTI)

- `src/types/index.ts` è il contratto del team: **non modificarlo senza prima avvisare il gruppo**. Le modifiche ai tipi passano dal responsabile integrazione (Angelo).
- `src/app/store.ts` e il file delle route: ognuno aggiunge solo la propria riga (registrazione slice / route) e avvisa il gruppo quando lo fa.
- Ogni feature ha un owner: non modificare file di feature altrui, chiedi all'owner.

## Workflow Git

- `main` = versione consegnabile. **Protetto: solo pull request** (ruleset attivo). Merge da develop solo a milestone.
- `develop` = branch di default e punto di raccolta. Deve restare sempre funzionante.
- Ogni feature su un branch `feature/nome-feature`, creato da develop. Branch piccoli, vita max 1-2 giorni.
- PR: `feature/x → develop`, review di almeno un altro membro.
- Ogni mattina: `git pull origin develop` e merge di develop nel proprio branch feature per risolvere i conflitti subito.
- Convenzione commit: prefissi tipo `feat:`, `fix:`, `chore:`.

## Divisione dei compiti

1. **Setup + store + integrazione** — Angelo (custode repo, review PR, risoluzione conflitti)
2. **Feed post (CRUD)** — feature a maggior logica: form in doppia modalità create/edit
3. **Auth/Login** — form, validazione, redirect, localStorage, ProtectedRoute
4. **Pagina profilo** — visualizzazione dati + aggiunta ruoli
5. **Layout + Navbar + riquadri laterali** — presentazione, responsive

Principio chiave: **nessuno aspetta nessuno**. Se serve qualcosa che non esiste ancora (es. l'utente loggato), si usa il mock condiviso in `src/mockData.ts` e lo si sostituisce all'integrazione.

## Convenzioni tecniche

- Usare sempre gli hooks tipizzati `useAppDispatch` / `useAppSelector` da `src/app/hooks.ts`, mai quelli raw di react-redux.
- Slice con `createSlice`; niente boilerplate Redux classico.
- Stato auth e post sincronizzati con localStorage per sopravvivere al refresh.
- I post mostrano come autore l'utente loggato (`state.auth.currentUser`).

## Comandi

- `npm run dev` — dev server
- `npm run build` — build di produzione (verificare che passi prima di ogni PR)
- `npm run lint` — ESLint
