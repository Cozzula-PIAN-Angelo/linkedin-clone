const footerLinks = [
  "Informazioni",
  "Accessibilità",
  "Centro Assistenza",
  "Privacy e condizioni",
  "Opzioni per gli annunci pubblicitari",
  "Pubblicità",
  "Servizi alle aziende",
  "Scarica l'app Linkedin",
  "Altro",
];

function Footer() {
  return (
    <div className="mt-3">
      <div className="d-flex flex-wrap gap-2">
        {footerLinks.map((link) => (
          <span
            key={link}
            className="text-secondary"
            style={{ fontSize: "0.7rem", cursor: "pointer" }}
          >
            {link}
          </span>
        ))}
      </div>
      <div
        className="d-flex align-items-center gap-1 mt-2 text-secondary"
        style={{ fontSize: "0.7rem" }}
      >
        <strong>LinkedIn</strong> LinkedIn Corporation © 2026
      </div>
    </div>
  );
}

export default Footer;
