import { useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  acceptRequest,
  fetchNetwork,
  removeConnection,
  sendRequest,
} from "../features/network/networkSlice";
import type { Connection, User } from "../types";

// Riga con avatar, nome e headline; se l'utente esiste linka al suo profilo
function PersonInfo({ user }: { user: User | undefined }) {
  const info = (
    <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
      <Avatar
        src={user?.avatar}
        name={user?.name ?? "?"}
        surname={user?.surname ?? "?"}
        size={48}
      />
      <div style={{ minWidth: 0 }}>
        <div className="fw-bold text-truncate">
          {user ? `${user.name} ${user.surname}` : "Utente eliminato"}
        </div>
        {user?.headline && (
          <div className="text-secondary small text-truncate">{user.headline}</div>
        )}
      </div>
    </div>
  );

  if (!user) return info;
  return (
    <Link
      to={`/profile/${user.id}`}
      className="text-decoration-none text-body"
      style={{ minWidth: 0 }}
    >
      {info}
    </Link>
  );
}

function NetworkPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const { connections, users, loading, error } = useAppSelector(
    (state) => state.network
  );
  const authors = useAppSelector((state) => state.posts.authors);

  useEffect(() => {
    dispatch(fetchNetwork());
  }, [dispatch]);

  // Dietro ProtectedRoute c'è sempre un utente loggato, ma TypeScript non lo sa
  if (!currentUser) return null;

  const meId = String(currentUser.id);

  // Tutti gli utenti conosciuti (reali + finti del feed), senza me e senza doppioni
  const everyone = new Map<string, User>();
  users.forEach((user) => everyone.set(String(user.id), user));
  authors.forEach((user) => {
    if (!everyone.has(String(user.id))) everyone.set(String(user.id), user);
  });
  everyone.delete(meId);

  const mine = connections.filter(
    (c) => String(c.requesterId) === meId || String(c.addresseeId) === meId
  );
  const received = mine.filter(
    (c) => c.status === "pending" && String(c.addresseeId) === meId
  );
  const sent = mine.filter(
    (c) => c.status === "pending" && String(c.requesterId) === meId
  );
  const accepted = mine.filter((c) => c.status === "accepted");

  // Suggerimenti: chi non ha nessun rapporto con me (né richiesta né collegamento)
  const relatedIds = new Set(
    mine.flatMap((c) => [String(c.requesterId), String(c.addresseeId)])
  );
  const suggestions = [...everyone.values()].filter(
    (user) => !relatedIds.has(String(user.id))
  );

  // L'altra persona coinvolta in una connessione (non io)
  const otherUser = (c: Connection) =>
    everyone.get(String(c.requesterId) === meId ? String(c.addresseeId) : String(c.requesterId));

  return (
    <Container style={{ paddingTop: 84, maxWidth: 1160 }}>
      <Row className="justify-content-center g-3">
        <Col xs={12} md={10} xl={8} className="px-0 px-md-3">
          {error && (
            <Alert variant="danger" className="py-2 small">
              {error}
            </Alert>
          )}

          {loading && connections.length === 0 && (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          )}

          {/* Inviti ricevuti */}
          <Card className="border-0 mb-3">
            <Card.Body>
              <Card.Title className="fs-6">
                Inviti ricevuti {received.length > 0 && `(${received.length})`}
              </Card.Title>
              {received.length === 0 ? (
                <div className="text-secondary small">Nessun invito in sospeso.</div>
              ) : (
                received.map((connection) => (
                  <div
                    key={connection.id}
                    className="d-flex align-items-center justify-content-between gap-2 py-2 border-top"
                  >
                    <PersonInfo user={otherUser(connection)} />
                    <div className="d-flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="rounded-pill"
                        onClick={() => dispatch(removeConnection(String(connection.id)))}
                      >
                        Ignora
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-pill"
                        onClick={() => dispatch(acceptRequest(connection))}
                      >
                        Accetta
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>

          {/* Richieste inviate, in attesa di risposta */}
          {sent.length > 0 && (
            <Card className="border-0 mb-3">
              <Card.Body>
                <Card.Title className="fs-6">Richieste inviate</Card.Title>
                {sent.map((connection) => (
                  <div
                    key={connection.id}
                    className="d-flex align-items-center justify-content-between gap-2 py-2 border-top"
                  >
                    <PersonInfo user={otherUser(connection)} />
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="rounded-pill flex-shrink-0"
                      onClick={() => dispatch(removeConnection(String(connection.id)))}
                    >
                      Ritira
                    </Button>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* I collegamenti veri e propri */}
          <Card className="border-0 mb-3">
            <Card.Body>
              <Card.Title className="fs-6">
                I tuoi collegamenti {accepted.length > 0 && `(${accepted.length})`}
              </Card.Title>
              {accepted.length === 0 ? (
                <div className="text-secondary small">
                  Ancora nessun collegamento: inizia dai suggerimenti qui sotto.
                </div>
              ) : (
                accepted.map((connection) => (
                  <div
                    key={connection.id}
                    className="d-flex align-items-center justify-content-between gap-2 py-2 border-top"
                  >
                    <PersonInfo user={otherUser(connection)} />
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="rounded-pill flex-shrink-0"
                      onClick={() => dispatch(removeConnection(String(connection.id)))}
                    >
                      Rimuovi
                    </Button>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>

          {/* Persone che potresti conoscere */}
          {suggestions.length > 0 && (
            <Card className="border-0 mb-3">
              <Card.Body>
                <Card.Title className="fs-6">Persone che potresti conoscere</Card.Title>
                <Row className="g-3 mt-0">
                  {suggestions.map((user) => (
                    <Col key={user.id} xs={12} sm={6} lg={4}>
                      <Card className="h-100 text-center">
                        <Card.Body className="d-flex flex-column align-items-center">
                          <Link
                            to={`/profile/${user.id}`}
                            className="text-decoration-none text-body d-flex flex-column align-items-center w-100"
                            style={{ minWidth: 0 }}
                          >
                            <Avatar
                              src={user.avatar}
                              name={user.name}
                              surname={user.surname}
                              size={64}
                            />
                            <OverlayTrigger
                              overlay={
                                <Tooltip>
                                  {user.name} {user.surname}
                                </Tooltip>
                              }
                            >
                              <div className="fw-bold mt-2 text-truncate w-100">
                                {user.name} {user.surname}
                              </div>
                            </OverlayTrigger>
                            {user.headline ? (
                              <OverlayTrigger overlay={<Tooltip>{user.headline}</Tooltip>}>
                                <div
                                  className="text-secondary small text-truncate w-100"
                                  style={{ minHeight: "1.2em" }}
                                >
                                  {user.headline}
                                </div>
                              </OverlayTrigger>
                            ) : (
                              <div
                                className="text-secondary small text-truncate w-100"
                                style={{ minHeight: "1.2em" }}
                              />
                            )}
                          </Link>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="rounded-pill mt-auto"
                            onClick={() => dispatch(sendRequest(String(user.id)))}
                          >
                            Collegati
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default NetworkPage;
