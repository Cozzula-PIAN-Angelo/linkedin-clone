import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";

// Tetto di dimensione: un video enorme intaserebbe Storage e il caricamento
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB

// Carica un video su Firebase Storage e restituisce l'URL scaricabile da
// salvare nel post. I video, a differenza delle immagini, non possono stare
// come base64 in un documento Firestore (limite 1 MB): vanno su Storage, e nel
// post si conserva solo il link.
export async function uploadVideo(file: File, uid: string): Promise<string> {
  if (!file.type.startsWith("video/")) {
    throw new Error("Il file selezionato non è un video");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error("Il video è troppo grande (massimo 50 MB)");
  }

  // Percorso per utente, con timestamp per non sovrascrivere file omonimi
  const path = `posts/${uid}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
