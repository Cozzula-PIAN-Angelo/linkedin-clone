import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateProfile, clearProfileError } from "./profileSlice";

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.currentUser);
  const { saving, error } = useAppSelector((state) => state.profile);

  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [professionalTitle, setProfessionalTitle] = useState(
    user?.headline ?? "",
  );

  useEffect(() => {
    dispatch(clearProfileError());
  }, [dispatch]);

  // Dietro ProtectedRoute c'è sempre un utente loggato, ma TypeScript non lo sa
  if (!user) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(
        updateProfile({ name, surname, headline: professionalTitle })
      ).unwrap();
      navigate("/profile");
    } catch {
      // errore già disponibile in state.profile.error, mostrato dall'Alert sotto
    }
  };

  const exit = () => {
    navigate("/profile");
  };

  return (
    <Container className="mt-3">
      <Row className="justify-content-center">
        <Col xs={12} md={10} xl={8} className="px-0 px-md-3">
          <Card className="profile-card border-0">
            <Card.Title className="mt-3 ps-3">Modifica profilo</Card.Title>
            <Card.Body className="d-flex flex-column align-items-center">
              <img
                src={user.avatar}
                alt={`${user.name} ${user.surname}`}
                className="avatar-profile rounded-circle mb-3"
              />
              <Button
                size="sm"
                className="bg-white text-muted border border-secondary mb-3"
              >
                Cambia foto
              </Button>

              <Form onSubmit={handleSubmit} className="w-100">
                {error && (
                  <Alert variant="danger" className="py-2 small">
                    {error}
                  </Alert>
                )}
                <Row className="g-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="editName">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="editSurname">
                      <Form.Label>Cognome</Form.Label>
                      <Form.Control
                        type="text"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="editProfessionalTitle">
                      <Form.Label>Titolo professionale</Form.Label>
                      <Form.Control
                        type="text"
                        value={professionalTitle}
                        onChange={(e) => setProfessionalTitle(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex">
                  <Button
                    type="button"
                    onClick={exit}
                    className="bg-white text-muted border border-secondary d-block ms-auto mt-3 me-2"
                  >
                    Annulla
                  </Button>
                  <Button type="submit" className="d-block mt-3" disabled={saving}>
                    {saving ? <Spinner animation="border" size="sm" /> : "Salva modifiche"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EditProfile;
