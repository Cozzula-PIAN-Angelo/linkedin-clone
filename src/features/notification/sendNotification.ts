import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

// Scrive una notifica su Firestore per un altro utente reale (mai per se
// stessi: un like/commento sul proprio post non deve autonotificarti).
// Se la scrittura fallisce non blocchiamo l'azione principale (like/commento
// è comunque andato a buon fine): la notifica persa non vale un errore in UI.

export async function sendNotification(
  recipientId: string,
  actorId: string,
  message: string,
): Promise<void> {
  if (recipientId === actorId) return;

  try {
    await addDoc(collection(db, "notifications"), {
      recipientId,
      actorId,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    });
  } catch {
    // fallimento silenzioso: non deve rompere like/commento/invito
  }
}
