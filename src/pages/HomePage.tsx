import { Container, Row, Col } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";
import { NewsSection } from "../features/news";
import { useCopy } from "../features/theme/copy";
import Footer from "../components/Footer";
import { Feed } from "../features/posts";

function HomePage() {
  const copy = useCopy();

  return (
    <Container style={{ paddingTop: 68 }}>
      <Row className="g-3">
        <Col xs={12} md={4} lg={2}>
          <ProfileCard />
        </Col>

        <Col xs={12} md={8} lg={7}>
          <Feed />
        </Col>

        <Col xs={12} lg={3}>
          <NewsSection />
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
