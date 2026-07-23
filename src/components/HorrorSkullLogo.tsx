export type HorrorSkullLogoProps = {
  size?: number;
};

// Logo custom per il tema Horror: teschio stilizzato, design originale.
function HorrorSkullLogo({ size = 20 }: HorrorSkullLogoProps) {
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
      <path
        d="M12 2C7.58 2 4 5.4 4 9.6c0 2.6 1.3 4.9 3.3 6.3L7 20h2.2l.4-2h4.8l.4 2H17l-.3-4.1c2-1.4 3.3-3.7 3.3-6.3C20 5.4 16.42 2 12 2z"
        fill="#fff"
      />
      <circle cx="8.7" cy="10.3" r="1.7" fill="#141414" />
      <circle cx="15.3" cy="10.3" r="1.7" fill="#141414" />
      <path d="M11.2 11.5h1.6l-.8 2.2z" fill="#141414" />
      <path
        d="M9 16.2h6M9.6 17.3h1M13.4 17.3h1"
        stroke="#141414"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default HorrorSkullLogo;
