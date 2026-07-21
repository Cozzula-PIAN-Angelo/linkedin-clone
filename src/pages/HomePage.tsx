import { Container, Row, Col } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";
import NewsPlaceholder from "../components/NewsPlaceholder";

function HomePage() {
  return (
    <Container fluid style={{ paddingTop: 68 }}>
      <Row className="g-3">
        <Col xs={12} md={4} lg={3}>
          <ProfileCard />
        </Col>

        <Col xs={12} md={8} lg={6}>
          {/* Feed post: task di un altro membro del team, qui solo placeholder */}
          <div className="bg-white rounded-2 border p-3 text-secondary text-center">
            Feed post (in arrivo)
          </div>
        </Col>

        <Col lg={3} className="d-none d-lg-block">
          <NewsPlaceholder />
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
