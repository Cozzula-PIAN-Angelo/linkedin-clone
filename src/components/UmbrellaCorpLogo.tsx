export type UmbrellaCorpLogoProps = {
  size?: number;
};

// Logo del tema Horror: reinterpretazione dell'emblema "Umbrella Corporation"
// (Resident Evil) — 8 spicchi triangolari alternati rosso/bianco, a punta
// dritta e con l'incavo tra una punta e l'altra, ricostruiti a mano in SVG
// (nessun asset originale copiato) calcolando i vertici per via trigonometrica
// invece di un tracciato copiato pixel per pixel.
const SEGMENTS = 8;
const CENTER = 12;
const OUTER_RADIUS = 11.2;
const NOTCH_RADIUS = 5;

function pointAt(angleDeg: number, radius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [CENTER + radius * Math.sin(rad), CENTER - radius * Math.cos(rad)];
}

function wedgePath(index: number): string {
  const step = 360 / SEGMENTS;
  const tipAngle = index * step;
  const [ax, ay] = pointAt(tipAngle - step / 2, NOTCH_RADIUS);
  const [tx, ty] = pointAt(tipAngle, OUTER_RADIUS);
  const [bx, by] = pointAt(tipAngle + step / 2, NOTCH_RADIUS);
  const [c1x, c1y] = pointAt(tipAngle - step / 4, OUTER_RADIUS * 0.92);
  const [c2x, c2y] = pointAt(tipAngle + step / 4, OUTER_RADIUS * 0.92);
  return `M${CENTER},${CENTER} L${ax},${ay} Q${c1x},${c1y} ${tx},${ty} Q${c2x},${c2y} ${bx},${by} Z`;
}

function UmbrellaCorpLogo({ size = 20 }: UmbrellaCorpLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <path
          key={i}
          d={wedgePath(i)}
          fill={i % 2 === 0 ? "#e4032e" : "#fff"}
          stroke="#000"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export default UmbrellaCorpLogo;
