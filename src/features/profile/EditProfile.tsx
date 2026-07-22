import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import type { User } from "../../types";
import { mockUsers } from "../../mockData";

function EditProfile() {
  const user: User = mockUsers[0];
  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [professionalTitle, setProfessionalTitle] = useState(
    () => localStorage.getItem("professionalTitle") ?? "Frontend Developer",
  );

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    localStorage.setItem("name", name);
    localStorage.setItem("surname", surname);
    localStorage.setItem("professionalTitle", professionalTitle);
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
                    className="bg-white text-muted border border-secondary d-block ms-auto mt-3 me-2"
                  >
                    Annulla
                  </Button>
                  <Button type="submit" className="d-block mt-3">
                    Salva modifiche
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
