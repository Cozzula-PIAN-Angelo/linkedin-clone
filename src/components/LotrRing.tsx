import type { CSSProperties, ReactNode } from "react";
import { useAppSelector } from "../app/hooks";

// Adattamento in React/CSS puro (no jQuery, no Sass/Bourbon) del pen
// "LOTR-ish Ring" di James Steinbach (https://codepen.io/jdsteinbach/pen/zYKyQp):
// 20 fasce dorate impilate e ruotate a incastro (transform 3D) formano un
// anello cilindrico che gira lentamente, con una frase incisa lettera per
// lettera attorno alla circonferenza.
const RING_COUNT = 20;
// Punti interpunti al posto degli spazi: ogni fascia (1 carattere) mostra
// sempre un segno visibile, niente "buchi" vuoti tra una lettera e l'altra.
const PHRASE = "QUESTO·NON·È·ELFICO·";

function buildRingLevel(index: number): ReactNode {
  if (index >= RING_COUNT) return null;

  return (
    <div className="lotr-ring" style={{ "--i": index } as CSSProperties}>
      <div className="lotr-ring-top" />
      <div className="lotr-ring-text">{PHRASE}</div>
      <div className="lotr-ring-bottom-1">
        <div className="lotr-ring-bottom-2" />
      </div>
      {buildRingLevel(index + 1)}
    </div>
  );
}

function LotrRing() {
  const brandTheme = useAppSelector((state) => state.theme.brandTheme);
  if (brandTheme !== "fantasy") return null;

  return (
    <div className="lotr-ring-scene">
      <div className="lotr-ring-bearer-center">
        <div className="lotr-ring-bearer">{buildRingLevel(0)}</div>
      </div>
    </div>
  );
}

export default LotrRing;
