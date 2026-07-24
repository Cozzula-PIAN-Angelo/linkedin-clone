import { useAppSelector } from "../../app/hooks";
import EvilEye from "../../components/effects/EvilEye";

// Sfondo "occhio infuocato", solo in modalità scura: di giorno il tema
// fantasy resta quello dell'Alleanza libera (verde/oro), l'occhio è
// un'apparizione notturna in stile Mordor.
function FantasyEffects() {
  const mode = useAppSelector((state) => state.theme.mode);

  if (mode !== "dark") return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ zIndex: -1 }}
    >
      <EvilEye eyeColor="#FFEE86" backgroundColor="#000000" pupilFollow={2} />
    </div>
  );
}

export default FantasyEffects;
