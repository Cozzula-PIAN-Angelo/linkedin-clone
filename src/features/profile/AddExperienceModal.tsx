import { useMemo, useState, type FormEvent } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useAppDispatch } from "../../app/hooks";
import { addExperience } from "./profileSlice";
import { useGetRemoteJobsQuery } from "../jobs/jobsApi";

const MAX_ROLE_SUGGESTIONS = 6;

const MONTHS = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => CURRENT_YEAR - i);

interface AddExperienceModalProps {
  show: boolean;
  onClose: () => void;
}

function AddExperienceModal({ show, onClose }: AddExperienceModalProps) {
  const dispatch = useAppDispatch();

  const [role, setRole] = useState("");
  const [roleFocused, setRoleFocused] = useState(false);
  const [company, setCompany] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(true);
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  // Pool di offerte reali usato anche da JobsPage: i suggerimenti qui sotto
  // vengono dai titoli effettivamente presenti nell'API, così l'esperienza
  // che l'utente aggiunge trova poi davvero corrispondenze nella ricerca lavori.
  const { data: jobs } = useGetRemoteJobsQuery(undefined, { skip: !show });

  const roleSuggestions = useMemo(() => {
    const q = role.trim().toLowerCase();
    if (q.length < 2 || !jobs) return [];

    const seen = new Set<string>();
    const suggestions: string[] = [];
    for (const job of jobs) {
      if (seen.has(job.title) || !job.title.toLowerCase().includes(q)) {
        continue;
      }
      seen.add(job.title);
      suggestions.push(job.title);
      if (suggestions.length >= MAX_ROLE_SUGGESTIONS) break;
    }
    return suggestions;
  }, [jobs, role]);

  const isValid =
    role.trim() !== "" && company.trim() !== "" && startYear !== "";

  function resetForm() {
    setRole("");
    setCompany("");
    setCurrentlyWorking(true);
    setStartMonth("");
    setStartYear("");
    setEndMonth("");
    setEndYear("");
    setDescription("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    const start = `${startMonth} ${startYear}`.trim();
    const end = currentlyWorking
      ? "Presente"
      : `${endMonth} ${endYear}`.trim();
    const period = `${start} - ${end}`;

    setSaving(true);
    try {
      await dispatch(
        addExperience({ role, company, period, description }),
      ).unwrap();
      resetForm();
      onClose();
    } catch {
      // l'errore resta disponibile in state.profile.error
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Aggiungi esperienza</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Titolo*</Form.Label>
            <Form.Control
              placeholder="Es. Retail Sales Manager"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onFocus={() => setRoleFocused(true)}
              onBlur={() => setRoleFocused(false)}
              autoComplete="off"
              required
            />

            {roleFocused && roleSuggestions.length > 0 && (
              <div
                className="position-absolute bg-body border rounded-2 shadow-sm w-100 mt-1 list-group list-group-flush"
                style={{ zIndex: 2000, overflow: "hidden" }}
              >
                {roleSuggestions.map((title) => (
                  <button
                    key={title}
                    type="button"
                    className="list-group-item list-group-item-action text-start"
                    // Impedisce che il campo perda il fuoco prima del click,
                    // altrimenti onBlur chiuderebbe la tendina prima del click
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setRole(title);
                      setRoleFocused(false);
                    }}
                  >
                    {title}
                  </button>
                ))}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Azienda o organizzazione*</Form.Label>
            <Form.Control
              placeholder="Es. Microsoft"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Check
            type="checkbox"
            id="currently-working"
            label="Attualmente ricopro questo ruolo"
            checked={currentlyWorking}
            onChange={(e) => setCurrentlyWorking(e.target.checked)}
            className="mb-3"
          />

          <Form.Label className="d-block mb-1">Data di inizio</Form.Label>
          <Row className="g-2 mb-3">
            <Col xs={6}>
              <Form.Select
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              >
                <option value="">Mese</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6}>
              <Form.Select
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                required
              >
                <option value="">Anno*</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {!currentlyWorking && (
            <>
              <Form.Label className="d-block mb-1">Data di fine</Form.Label>
              <Row className="g-2 mb-3">
                <Col xs={6}>
                  <Form.Select
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                  >
                    <option value="">Mese</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs={6}>
                  <Form.Select
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                  >
                    <option value="">Anno</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </>
          )}

          <Form.Group>
            <Form.Label>Descrizione (facoltativa)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            className="rounded-pill"
            disabled={!isValid || saving}
          >
            {saving ? "Salvataggio..." : "Salva"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddExperienceModal;
