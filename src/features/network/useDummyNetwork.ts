import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { dummyInvitesSeeded, dummyRequestAccepted } from "./networkSlice";
import { addNotification } from "../notification/notificationSlice";
import { DUMMY_PREFIX, isDummyId } from "../posts/dummyFeed";
import type { Connection } from "../../types";

// Ritardo con cui un utente finto "accetta" la nostra richiesta (3-8 secondi)
function acceptDelay(): number {
  return 3000 + Math.random() * 5000;
}

// Dà vita alla rete, come useDummyActivity fa col feed: un paio di inviti
// finti in arrivo, e gli utenti finti accettano le richieste dopo qualche
// secondo (con notifica sulla campanella). Tutto solo in memoria: db.json
// contiene sempre e solo le connessioni vere del team.
export function useDummyNetwork() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const authors = useAppSelector((state) => state.posts.authors);
  const connections = useAppSelector((state) => state.network.connections);

  // Semina gli inviti una sola volta per sessione. Il doppio mount di
  // StrictMode rieseguirebbe l'effetto con lo stesso stato: il ref lo blocca
  // (il ref sopravvive al setup/cleanup/setup di StrictMode)
  const invitesSeeded = useRef(false);

  // Semina 2 inviti finti appena gli utenti finti del feed sono disponibili,
  // con relativa notifica sulla campanella (come un vero invito ricevuto)
  useEffect(() => {
    if (!currentUser || invitesSeeded.current) return;
    if (connections.some((c) => isDummyId(c.id))) return;

    const dummies = authors.filter((user) => isDummyId(user.id));
    if (dummies.length === 0) return;

    const shuffled = [...dummies].sort(() => Math.random() - 0.5);
    const invites: Connection[] = shuffled.slice(0, 2).map((user, i) => ({
      id: `${DUMMY_PREFIX}conn-invito${i}-${Date.now()}`,
      requesterId: String(user.id),
      addresseeId: String(currentUser.id),
      status: "pending",
      createdAt: new Date().toISOString(),
    }));

    invitesSeeded.current = true;
    dispatch(dummyInvitesSeeded(invites));

    invites.forEach((invite) => {
      const requester = shuffled.find(
        (user) => String(user.id) === String(invite.requesterId)
      );
      dispatch(
        addNotification(
          requester
            ? `${requester.name} ${requester.surname} vuole collegarsi con te`
            : "Hai un nuovo invito di collegamento"
        )
      );
    });
  }, [authors, connections, currentUser, dispatch]);

  // Le richieste inviate a utenti finti vengono accettate dopo un po'.
  // I timer vivono quanto questo effetto: se le connessioni cambiano,
  // la cleanup li annulla e il giro successivo li ricrea da capo.
  useEffect(() => {
    if (!currentUser) return;

    const timers = connections
      .filter(
        (c) =>
          c.status === "pending" &&
          String(c.requesterId) === String(currentUser.id) &&
          isDummyId(c.addresseeId)
      )
      .map((connection) => {
        const author = authors.find(
          (user) => String(user.id) === String(connection.addresseeId)
        );
        return window.setTimeout(() => {
          dispatch(dummyRequestAccepted(connection.id));
          dispatch(
            addNotification(
              author
                ? `${author.name} ${author.surname} ha accettato il tuo invito di collegamento`
                : "Il tuo invito di collegamento è stato accettato"
            )
          );
        }, acceptDelay());
      });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [connections, authors, currentUser, dispatch]);
}
