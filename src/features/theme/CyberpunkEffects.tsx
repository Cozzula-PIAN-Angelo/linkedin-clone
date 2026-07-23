import { useAppSelector } from "../../app/hooks";
import LetterGlitch from "../../components/effects/LetterGlitch";
import TargetCursor from "../../components/effects/TargetCursor";

const warmGlitchColors = ["#ff0044", "#ffe600", "#3a0000"];
const coolGlitchColors = ["#9d00ff", "#2b6bff", "#05001a"];

function CyberpunkEffects() {
  const mode = useAppSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ zIndex: -1, opacity: 0.9 }}
      >
        <LetterGlitch glitchColors={isDark ? coolGlitchColors : warmGlitchColors} />
      </div>
      <TargetCursor cursorColor={isDark ? "#9d00ff" : "#ff0044"} />
    </>
  );
}

export default CyberpunkEffects;
