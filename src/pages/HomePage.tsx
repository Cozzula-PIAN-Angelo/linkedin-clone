import { Container, Row, Col } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";
import LotrRing from "../components/LotrRing";
import { NewsSection } from "../features/news";
import Footer from "../components/Footer";
import { Feed } from "../features/posts";

function HomePage() {
  return (
    <Container style={{ paddingTop: 80, maxWidth: 1160 }}>
      <Row className="g-3">
        <Col xs={12} md={4} lg={2} className="home-col-profile">
          <ProfileCard />
          <LotrRing />
        </Col>

        <Col xs={12} md={8} lg={7} className="home-col-feed">
          <Feed />
        </Col>

        <Col xs={12} lg={3} className="home-col-news">
          <NewsSection />
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
