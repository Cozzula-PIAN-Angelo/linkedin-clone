// codice utile esclusivamente al server , per costringerlo a farlo partire senza blocchi nei nodi

import jsonServer from 'json-server';
import auth from 'json-server-auth';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Associa le regole di autenticazione di json-server-auth
server.db = router.db;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Normalizza le email in minuscolo su ogni richiesta (login, registrazione, modifiche):
// così "CRISTIAN@ERROR.IT" e "cristian@error.it" sono lo stesso account.
server.use((req, res, next) => {
  if (req.body && typeof req.body.email === 'string') {
    req.body.email = req.body.email.trim().toLowerCase();
  }
  next();
});

server.use(auth);
server.use(router);

// Nota: json-server-auth gestisce POST /login e POST /users (bcrypt + JWT)
// e NON restituisce mai la password nella risposta: è il comportamento
// corretto, il frontend non deve mai ricevere né salvare la password.

server.listen(3000, () => {
  console.log('JSON Server Auth is running on http://localhost:3000');
});
