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
        <LetterGlitch
          key={mode}
          glitchColors={isDark ? coolGlitchColors : warmGlitchColors}
          glitchSpeed={85}
        />
      </div>
      <TargetCursor
        cursorColor={isDark ? "#9d00ff" : "#ff0044"}
        cursorColorOnTarget={isDark ? "#2b6bff" : "#ffe600"}
        spinDuration={3}
      />
    </>
  );
}

export default CyberpunkEffects;
