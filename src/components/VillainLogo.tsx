export type VillainLogoProps = {
  size?: number;
};

// Logo custom: maschera/casco da villain con sorriso malefico e zanne.
// Design originale (non riproduce elmetti di personaggi protetti da copyright).
function VillainLogo({ size = 20 }: VillainLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      <path d="M12 2 5 7v6c0 4.5 3 8.3 7 9 4-.7 7-4.5 7-9V7l-7-5z" fill="#fff" />
      <path d="M7 9 11 10.5 7 12z" fill="#141414" />
      <path d="M17 9 13 10.5 17 12z" fill="#141414" />
      <path
        d="M6.5 15c1.8 2.6 3.7 3.8 5.5 3.8s3.7-1.2 5.5-3.8"
        stroke="#141414"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M9 15.8 10.2 15.8 9.6 18.2z" fill="#141414" />
      <path d="M13.8 15.8 15 15.8 14.4 18.2z" fill="#141414" />
    </svg>
  );
}

export default VillainLogo;
