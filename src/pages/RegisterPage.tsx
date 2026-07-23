import { Link } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import RegisterForm from "../features/auth/RegisterForm";

function RegisterPage() {
  return (
    <Container className="min-vh-100 d-flex align-items-center">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow-sm border-0 rounded-3 p-4">
            <Card.Body>
              <Card.Title as="h1" className="h5 text-center fw-bold mb-3">
                Iscriviti a LinkedIn
              </Card.Title>

              <RegisterForm />

              <div className="text-center mt-3 small">
                <span className="text-muted me-1">Hai già un account?</span>
                <Link to="/login" className="fw-bold text-decoration-none">
                  Accedi
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
