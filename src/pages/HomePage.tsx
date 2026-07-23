import { Container, Row, Col } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";
import { NewsSection } from "../features/news";
import { useCopy } from "../features/theme/copy";

function HomePage() {
  const copy = useCopy();

  return (
    <Container style={{ paddingTop: 68 }}>
      <Row className="g-3">
        <Col xs={12} md={4} lg={2}>
          <ProfileCard />
        </Col>

        <Col xs={12} md={8} lg={7}>
          {/* Feed post: task di un altro membro del team, qui solo placeholder */}
          <div className="bg-body rounded-2 border p-3 text-secondary text-center">
            {copy.feedPlaceholder}
          </div>
        </Col>

        <Col lg={3} className="d-none d-lg-block">
          <NewsSection />
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
