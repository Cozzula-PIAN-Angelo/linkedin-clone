import { useAppSelector } from "../../app/hooks";

export type Copy = {
  pageTitle: string;
  brandName: string;
  nav: {
    network: string;
    jobs: string;
    messaging: string;
    more: string;
  };
  searchPlaceholder: string;
  notifications: {
    label: string;
    empty: string;
  };
  userMenu: {
    logout: string;
    deleteAccount: string;
  };
  deleteModal: {
    title: string;
    bodyBefore: string;
    bodyAfter: string;
    cancel: string;
    confirm: string;
    confirming: string;
  };
  feedPlaceholder: string;
  profile: {
    connections: string;
    growNetwork: string;
  };
  news: {
    title: string;
    error: string;
  };
  login: {
    title: string;
    newHere: string;
    signUpLink: string;
    submit: string;
  };
  register: {
    title: string;
    alreadyHave: string;
    headlinePlaceholder: string;
    submit: string;
  };
  notFound: {
    title: string;
    message: string;
    backHome: string;
  };
};

const defaultCopy: Copy = {
  pageTitle: "linkedin-clone",
  brandName: "LinkedIn",
  nav: {
    network: "Il mio network",
    jobs: "Lavoro",
    messaging: "Messaggistica",
    more: "Altro",
  },
  searchPlaceholder: "Cerca",
  notifications: {
    label: "Notifiche",
    empty: "Nessuna notifica",
  },
  userMenu: {
    logout: "Esci",
    deleteAccount: "Elimina account",
  },
  deleteModal: {
    title: "Eliminare l'account?",
    bodyBefore: "L'account ",
    bodyAfter:
      " verrà cancellato per sempre dal server, insieme ai suoi dati. L'operazione non si può annullare.",
    cancel: "Annulla",
    confirm: "Elimina definitivamente",
    confirming: "Eliminazione...",
  },
  feedPlaceholder: "Feed post (in arrivo)",
  profile: {
    connections: "Collegamenti",
    growNetwork: "Amplia la tua rete",
  },
  news: {
    title: "Novità di lavoro",
    error: "Impossibile caricare le notizie al momento.",
  },
  login: {
    title: "Accedi a LinkedIn",
    newHere: "Sei nuovo su LinkedIn?",
    signUpLink: "Iscriviti ora",
    submit: "Accedi",
  },
  register: {
    title: "Iscriviti a LinkedIn",
    alreadyHave: "Hai già un account?",
    headlinePlaceholder: "es. Full Stack Developer",
    submit: "Registrati",
  },
  notFound: {
    title: "Pagina non trovata",
    message: "Il link che hai seguito non porta da nessuna parte.",
    backHome: "Torna alla home",
  },
};

const villainCopy: Copy = {
  pageTitle: "ex-Villain | La rete per super-cattivi disoccupati",
  brandName: "ex-Villain",
  nav: {
    network: "La Congrega",
    jobs: "Taglie",
    messaging: "Messaggi Segreti",
    more: "Altri Piani",
  },
  searchPlaceholder: "Cerca un bersaglio...",
  notifications: {
    label: "Allarmi",
    empty: "Nessun allarme. Per ora.",
  },
  userMenu: {
    logout: "Fuggi",
    deleteAccount: "Cancella identità segreta",
  },
  deleteModal: {
    title: "Distruggere la tua identità segreta?",
    bodyBefore: "Il fascicolo di ",
    bodyAfter:
      " verrà bruciato per sempre negli archivi della Lega, insieme a tutti i tuoi dati. Non c'è modo di tornare indietro.",
    cancel: "Ritirata",
    confirm: "Brucia tutto",
    confirming: "Sto bruciando...",
  },
  feedPlaceholder: "Bacheca delle Malefatte (in arrivo)",
  profile: {
    connections: "Alleati",
    growNetwork: "Recluta il tuo esercito",
  },
  news: {
    title: "Bollettino delle Taglie",
    error: "Il corvo messaggero non è arrivato. Riprova più tardi.",
  },
  login: {
    title: "Accedi a ex-Villain",
    newHere: "Sei nuovo tra i cattivi?",
    signUpLink: "Unisciti alla Lega",
    submit: "Infiltrati",
  },
  register: {
    title: "Unisciti a ex-Villain",
    alreadyHave: "Hai già un fascicolo?",
    headlinePlaceholder: "es. Signore del Male in pensione",
    submit: "Unisciti alla Lega",
  },
  notFound: {
    title: "Nascondiglio non trovato",
    message: "Questo covo è stato smantellato. O non è mai esistito.",
    backHome: "Torna al quartier generale",
  },
};

const fantasyCopy: Copy = {
  pageTitle: "Regno Libero | La rete dei viandanti e degli eroi",
  brandName: "Regno Libero",
  nav: {
    network: "La Compagnia",
    jobs: "Missioni",
    messaging: "Corvi Messaggeri",
    more: "Pergamene",
  },
  searchPlaceholder: "Cerca tra i viandanti...",
  notifications: {
    label: "Presagi",
    empty: "Nessun presagio, per ora",
  },
  userMenu: {
    logout: "Lascia la Taverna",
    deleteAccount: "Cancella il nome dalle Cronache",
  },
  deleteModal: {
    title: "Cancellare il tuo nome dalle Cronache?",
    bodyBefore: "Le gesta di ",
    bodyAfter:
      " saranno cancellate per sempre dalle Cronache del Regno, insieme a tutti i tuoi ricordi. Non c'è ritorno da questo cammino.",
    cancel: "Ritorna sui tuoi passi",
    confirm: "Cancella per sempre",
    confirming: "Le pergamene bruciano...",
  },
  feedPlaceholder: "Taverna (in arrivo)",
  profile: {
    connections: "Compagni di viaggio",
    growNetwork: "Radduna la tua Compagnia",
  },
  news: {
    title: "Bandi e Proclami",
    error: "Il corvo messaggero si è perso. Riprova più tardi.",
  },
  login: {
    title: "Entra nella Taverna",
    newHere: "Nuovo viandante da queste parti?",
    signUpLink: "Unisciti alla Compagnia",
    submit: "Entra",
  },
  register: {
    title: "Unisciti alla Compagnia",
    alreadyHave: "Hai già un nome nelle Cronache?",
    headlinePlaceholder: "es. Guardiano dei Confini",
    submit: "Giura fedeltà",
  },
  notFound: {
    title: "Sentiero perduto",
    message: "Questo cammino non è segnato su nessuna mappa del Regno.",
    backHome: "Torna alla Taverna",
  },
};

// Tutti i temi easter egg condividono gli stessi testi "da cattivo"
// (villainCopy), tranne fantasy che ha la sua nomenclatura dedicata.
// Il default (LinkedIn normale) usa invece i testi originali.
export function useCopy(): Copy {
  const brandTheme = useAppSelector((state) => state.theme.brandTheme);
  if (brandTheme === "default") return defaultCopy;
  if (brandTheme === "fantasy") return fantasyCopy;
  return villainCopy;
}
