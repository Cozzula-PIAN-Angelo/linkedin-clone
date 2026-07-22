import { useState } from "react";
import type { User } from "../../types";
import { mockUsers, mockPosts } from "../../mockData";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import RoleForm from "./RoleForm";
import type { ExperienceFormData } from "./RoleForm";
import Experencies from "./Experiences";
import Posts from "./Posts";

function ProfilePage() {
  const user: User = mockUsers[0];
  const userPosts = mockPosts.filter((post) => post.authorId === user.id);
  const [experiences, setExperencies] = useState<
    (ExperienceFormData & { id: string })[]
  >([]);
  return (
    <>
      <Container className="mt-3">
        <Row className="justify-content-center">
          <Col xs={12} md={10} xl={8} className="px-0 px-md-3">
            <Card className="profile-card border-0">
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

      <Container className="mt-3">
        <Row className="justify-content-center">
          <Col xs={12} md={10} xl={8} className="px-0 px-md-3">
            <RoleForm
              onAdd={(exp) =>
                setExperencies([
                  ...experiences,
                  { id: crypto.randomUUID(), ...exp },
                ])
              }
            />
          </Col>
        </Row>
      </Container>

      <Container className="mt-3">
        <Row className="justify-content-center">
          <Col xs={12} md={10} xl={8} className="px-0 px-md-3">
            <Experencies experiences={experiences} />
          </Col>
        </Row>
      </Container>

      <Container className="mt-3">
        <Row className="justify-content-center">
          <Col xs={12} md={10} xl={8} className="px-0 px-md-3">
            <Posts posts={userPosts} user={user} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ProfilePage;
