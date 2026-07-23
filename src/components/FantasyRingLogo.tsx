export type FantasyRingLogoProps = {
  size?: number;
};

// Logo custom per il tema Fantasy: anello d'oro stilizzato (citazione generica
// del "Signore degli Anelli", nessuna iscrizione o grafica protetta da copyright).
function FantasyRingLogo({ size = 20 }: FantasyRingLogoProps) {
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
      <defs>
        <linearGradient id="fantasyRingGold" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#fff2b8" />
          <stop offset="45%" stopColor="#e6b800" />
          <stop offset="100%" stopColor="#8a6d1d" />
        </linearGradient>
      </defs>
      {/* medaglione scuro fisso: garantisce contrasto anche quando lo
          sfondo del badge (bg-primary) è già dorato, come in dark mode */}
      <circle cx="12" cy="12" r="11" fill="#1a1207" />
      {/* ellisse inclinata invece di un cerchio: si legge come un anello
          visto di scorcio, non come un occhio */}
      <ellipse
        cx="12"
        cy="12"
        rx="7.6"
        ry="4.4"
        stroke="url(#fantasyRingGold)"
        strokeWidth="3.1"
        transform="rotate(-25 12 12)"
      />
    </svg>
  );
}

export default FantasyRingLogo;
