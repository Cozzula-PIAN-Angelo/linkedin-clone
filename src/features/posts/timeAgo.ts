// Converte una data ISO nel formato compatto di LinkedIn: "Ora", "5 min", "2 h", "3 g", "2 sett"
export function timeAgo(isoDate: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);

  if (seconds < 60) return "Ora";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} g`;

  const weeks = Math.floor(days / 7);
  if (weeks < 52) return `${weeks} sett`;

  const years = Math.floor(weeks / 52);
  return `${years} anni`;
}
