// codice utile esclusivamente al server , per costringerlo a farlo partire senza blocchi nei nodi 

import jsonServer from 'json-server';
import auth from 'json-server-auth';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Associa le regole di autenticazione di json-server-auth
server.db = router.db;

server.use(middlewares);
server.use(auth);
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server Auth is running on http://localhost:3000');
});