import { Card } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";

// Card "Panoramica rete" della sidebar sinistra: mostra solo le statistiche
// reali che abbiamo (inviti inviati, collegamenti). Niente Gruppi/Eventi/
// Pagine/Newsletter/Già segui: non esiste nessuna di queste feature
// nell'app, quindi non ha senso mostrare numeri finti.
function NetworkOverview() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const { connections } = useAppSelector((state) => state.network);

  if (!currentUser) return null;

  const meId = String(currentUser.id);
  const mine = connections.filter(
    (c) => String(c.requesterId) === meId || String(c.addresseeId) === meId
  );
  const sentCount = mine.filter(
    (c) => c.status === "pending" && String(c.requesterId) === meId
  ).length;
  const acceptedCount = mine.filter((c) => c.status === "accepted").length;

  return (
    <Card as="aside" aria-label="Panoramica rete" className="bg-white rounded-2 border mb-3">
      <Card.Body>
        <Card.Title className="fs-6 mb-3">Panoramica rete</Card.Title>
        <div className="d-flex justify-content-around text-center">
          <div>
            <div className="fw-bold fs-5">{sentCount}</div>
            <div className="text-secondary small">Inviti inviati</div>
          </div>
          <div>
            <div className="fw-bold fs-5">{acceptedCount}</div>
            <div className="text-secondary small">Collegamenti</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default NetworkOverview;
