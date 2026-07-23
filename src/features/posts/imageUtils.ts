// json-server non gestisce l'upload di file veri: salviamo l'immagine come
// data URL (base64) dentro db.json. Prima però la ridimensioniamo con un
// canvas, altrimenti una foto da svariati MB farebbe esplodere il database.
export function fileToResizedDataUrl(
  file: File,
  maxWidth = 1080,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Il file selezionato non è un'immagine"));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Impossibile elaborare l'immagine"));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Formato immagine non supportato"));
    };

    img.src = objectUrl;
  });
}
