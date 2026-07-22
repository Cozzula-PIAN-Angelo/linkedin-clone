import type { NotificationItem } from "./types";

export const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    message: "Mario Rossi ha commentato il tuo post",
    time: "10 min fa",
    read: false,
  },
  {
    id: "n2",
    message: "Il tuo collegamento Chiara Moreschi ha cambiato lavoro",
    time: "2 ore fa",
    read: false,
  },
  {
    id: "n3",
    message: "Hai una nuova visualizzazione del profilo",
    time: "1 giorno fa",
    read: true,
  },
  {
    id: "n4",
    message: "Luca Bianchi ha messo mi piace al tuo post",
    time: "30 min fa",
    read: false,
  },
  {
    id: "n5",
    message: "Nuovo invito di collegamento da Giulia Ferrari",
    time: "3 ore fa",
    read: false,
  },
  {
    id: "n6",
    message:
      "Epicode ha pubblicato una nuova offerta di lavoro in linea con il tuo profilo",
    time: "5 ore fa",
    read: true,
  },
  {
    id: "n7",
    message: "Il tuo post è stato condiviso da Andrea Verdi",
    time: "2 giorni fa",
    read: true,
  },
];
