import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
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
    (state) => !state.posts.loading && state.posts.error === null
  );
  const items = useAppSelector((state) => state.posts.items);

  // I timer leggono i post dal ref: così vedono sempre il feed aggiornato
  // senza dover riavviare l'effetto a ogni cambiamento
  const itemsRef = useRef(items);
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
          (user) => !post.likes.includes(String(user.id))
        );
        if (candidates.length > 0) {
          const user = candidates[Math.floor(Math.random() * candidates.length)];
          dispatch(
            dummyLikeArrived({ postId: String(post.id), userId: String(user.id) })
          );
        }
      } else {
        // Un utente finto commenta un post a caso (anche vostro)
        const post = posts[Math.floor(Math.random() * posts.length)];
        dispatch(dummyCommentArrived(buildDummyComment(pools, String(post.id))));
      }

      timer = window.setTimeout(() => performRandomActivity(pools), nextDelay());
    };

    (async () => {
      try {
        const pools = await fetchDummyPools();
        if (cancelled) return;

        // Semina il mix iniziale (il reducer ignora la chiamata se già fatto)
        if (!itemsRef.current.some((post) => isDummyId(post.id))) {
          dispatch(seedDummyFeed(buildInitialDummyFeed(pools)));
        }

        timer = window.setTimeout(() => performRandomActivity(pools), nextDelay());
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
