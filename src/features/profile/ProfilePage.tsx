import type { User } from "../../types";
import { mockUsers } from "../../mockData";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

function ProfilePage() {
  const user: User = mockUsers[0];
  return (
    <Container className="mt-3">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={6}>
          <Card className="profile-card">
            <Card.Body className="d-flex flex-column align-items-center">
              <img
                src={user.avatar}
                alt={`${user.name} ${user.surname}`}
                className="avatar-profile rounded-circle mb-3"
              />
              <Card.Title>
                {user.name} {user.surname}
              </Card.Title>
              <Card.Subtitle className="text-secondary mb-2">
                {user.job.map((job) => job.title).join("| ")}
              </Card.Subtitle>
              <Button className="bg-white text-primary ">
                Modifica profilo
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
