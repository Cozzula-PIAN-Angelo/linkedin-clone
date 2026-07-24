import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { BriefcaseFill, Search } from "react-bootstrap-icons";
import ProfileCard from "../../components/ProfileCard";
import { useAppSelector } from "../../app/hooks";
import { useLazyGetRemoteJobsQuery } from "./jobsApi";

function JobsPage() {
  // ProfileCard (colonna sinistra qui sotto) carica già le esperienze
  // dell'utente loggato in state.profile.experiences.
  const experiences = useAppSelector((state) => state.profile.experiences);

  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [autoApplied, setAutoApplied] = useState(false);
  const [suggestedFrom, setSuggestedFrom] = useState<string | null>(null);
  const [fetchJobs, { data: jobs, isFetching, isError }] =
    useLazyGetRemoteJobsQuery();

  // Appena arrivano le esperienze, se non ha già cercato manualmente,
  // pre-filtra usando il ruolo dell'esperienza aggiunta più di recente.
  // Aggiornamento di stato durante il render (non in un effetto) per
  // evitare render a cascata: si autolimita con il guard "!autoApplied".
  if (!autoApplied && !hasSearched && experiences.length > 0) {
    const latest = experiences[experiences.length - 1];
    setAutoApplied(true);
    setQuery(latest.role);
    setSuggestedFrom(latest.role);
    setHasSearched(true);
  }

  // La chiamata all'API (vero side effect) parte solo dopo che il render
  // qui sopra ha applicato il pre-filtro.
  useEffect(() => {
    if (autoApplied) fetchJobs();
  }, [autoApplied, fetchJobs]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setHasSearched(true);
    setSuggestedFrom(null);
    fetchJobs();
  }

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    const q = query.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((job) =>
      `${job.title} ${job.company} ${job.location} ${job.jobType}`
        .toLowerCase()
        .includes(q),
    );
  }, [jobs, query]);

  return (
    <Container style={{ paddingTop: 80, maxWidth: 1160 }}>
      <Row className="g-3">
        <Col xs={12} md={4} lg={3} className="sticky-sidebar">
          <ProfileCard />
        </Col>

        <Col xs={12} md={8} lg={9}>
          <Form
            className="d-flex gap-2 mb-3 mx-auto mx-md-0"
            style={{ maxWidth: 420 }}
            onSubmit={handleSearch}
          >
            <div className="input-group">
              <span className="input-group-text bg-body-secondary border-0 rounded-start-pill ps-3">
                <Search />
              </span>
              <Form.Control
                placeholder="Descrivi il lavoro che vorresti"
                className="bg-body-secondary border-0 rounded-end-pill pe-3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="rounded-pill flex-shrink-0">
              Cerca
            </Button>
          </Form>

          {!hasSearched && (
            <Card className="text-center">
              <Card.Body className="py-5">
                <BriefcaseFill size={48} className="text-muted mb-3" />
                <Card.Title>Cerca offerte di lavoro</Card.Title>
                <Card.Text className="text-muted">
                  Avvia una ricerca e condivideremo le opportunità che
                  corrispondono ai tuoi criteri.
                </Card.Text>
              </Card.Body>
            </Card>
          )}

          {isFetching && (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          )}

          {isError && (
            <Alert variant="warning">
              Impossibile caricare le offerte di lavoro al momento.
            </Alert>
          )}

          {suggestedFrom && hasSearched && (
            <div className="text-muted small mb-2">
              Suggerimenti basati sulla tua ultima esperienza: "
              {suggestedFrom}"
            </div>
          )}

          {hasSearched && jobs && (
            <ListGroup>
              {filteredJobs.length === 0 && (
                <ListGroup.Item>Nessuna offerta trovata.</ListGroup.Item>
              )}
              {filteredJobs.map((job) => (
                <ListGroup.Item
                  key={job.id}
                  as="a"
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  action
                  className="d-flex gap-3 align-items-start"
                >
                  {job.companyLogo && (
                    <img
                      src={job.companyLogo}
                      alt=""
                      width={48}
                      height={48}
                      className="rounded"
                    />
                  )}
                  <div>
                    <div className="fw-semibold">{job.title}</div>
                    <div className="text-muted small">
                      {job.company} · {job.location}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default JobsPage;
