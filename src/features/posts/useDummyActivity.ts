import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addNotification } from "../notification/notificationSlice";
import {
  dummyCommentArrived,
  dummyLikeArrived,
  dummyPostArrived,
  seedDummyFeed,
} from "./postsSlice";
import {
  buildDummyComment,
  buildDummyPost,
  buildInitialDummyFeed,
  fetchDummyPools,
  isDummyId,
} from "./dummyFeed";
import type { DummyPools } from "./dummyFeed";

// Prossimo intervallo casuale tra un'attività finta e l'altra (8-25 secondi)
function nextDelay(): number {
  return 8000 + Math.random() * 17000;
}

// Fa sembrare l'app un social frequentato: al primo caricamento mescola nel
// feed post finti da DummyJSON, poi a intervalli casuali gli utenti finti
// pubblicano nuovi post, mettono "Consiglia" e commentano. Tutto solo in
// memoria: db.json contiene sempre e solo i dati veri del team.
//
// Nota StrictMode: in sviluppo React monta i componenti due volte, quindi
// questo effetto parte, viene annullato e riparte. Per questo non usiamo
// nessun flag "già avviato" qui: la cleanup annulla i timer della partenza
// precedente, e a evitare i doppioni del seed ci pensa il reducer
// seedDummyFeed, che ignora la chiamata se i dati finti ci sono già.
export function useDummyActivity() {
  const dispatch = useAppDispatch();
  const ready = useAppSelector(
    (state) => !state.posts.loading && state.posts.error === null,
  );
  const items = useAppSelector((state) => state.posts.items);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // I timer leggono i post dal ref: così vedono sempre il feed aggiornato
  // senza dover riavviare l'effetto a ogni cambiamento
  const itemsRef = useRef(items);
  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (!ready) return;

    let timer: number | undefined;
    let cancelled = false;

    const performRandomActivity = (pools: DummyPools) => {
      const posts = itemsRef.current;
      const roll = Math.random();

      if (roll < 0.4 || posts.length === 0) {
        // Un utente finto pubblica un nuovo post
        dispatch(dummyPostArrived(buildDummyPost(pools)));
      } else if (roll < 0.7) {
        // Un utente finto mette "Consiglia" a un post a caso (anche vostro)
        const post = posts[Math.floor(Math.random() * posts.length)];
        const candidates = pools.users.filter(
          (user) => !post.likes.includes(String(user.id)),
        );
        if (candidates.length > 0) {
          const user =
            candidates[Math.floor(Math.random() * candidates.length)];
          dispatch(
            dummyLikeArrived({
              postId: String(post.id),
              userId: String(user.id),
            }),
          );

          if (String(post.authorId) === String(currentUserRef.current?.id)) {
            dispatch(
              addNotification(
                `${user.name} ${user.surname} ha messo "Consiglia" al tuo post`,
              ),
            );
          }
        }
      } else {
        // Un utente finto commenta un post a caso (anche vostro)
        const post = posts[Math.floor(Math.random() * posts.length)];
        const comment = buildDummyComment(pools, String(post.id));
        dispatch(dummyCommentArrived(comment));

        if (String(post.authorId) === String(currentUserRef.current?.id)) {
          const author = pools.users.find(
            (user) => String(user.id) === String(comment.authorId),
          );
          dispatch(
            addNotification(
              author
                ? `${author.name} ${author.surname} ha commentato il tuo post`
                : "Hai un nuovo commento al tuo post",
            ),
          );
        }
      }

      timer = window.setTimeout(
        () => performRandomActivity(pools),
        nextDelay(),
      );
    };

    (async () => {
      try {
        const pools = await fetchDummyPools();
        if (cancelled) return;

        // Semina il mix iniziale (il reducer ignora la chiamata se già fatto)
        if (!itemsRef.current.some((post) => isDummyId(post.id))) {
          dispatch(seedDummyFeed(buildInitialDummyFeed(pools)));
        }

        timer = window.setTimeout(
          () => performRandomActivity(pools),
          nextDelay(),
        );
      } catch {
        // DummyJSON non raggiungibile: pazienza, il feed mostra solo i post veri
      }
    })();

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [ready, dispatch]);
}
