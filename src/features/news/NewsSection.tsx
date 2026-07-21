import { Alert, Card, ListGroup, Spinner } from "react-bootstrap";
import { useGetLatestNewsQuery } from "./newsApi";

function NewsSection() {
  const { data: news, isLoading, isError } = useGetLatestNewsQuery();

  return (
    <Card as="aside" aria-label="Novità di lavoro">
      <Card.Body>
        <Card.Title as="h2" className="h6 mb-0">
          Novità di lavoro
        </Card.Title>
      </Card.Body>

      {isLoading && (
        <Card.Body className="text-center">
          <Spinner animation="border" size="sm" />
        </Card.Body>
      )}

      {isError && (
        <Card.Body>
          <Alert variant="warning" className="mb-0">
            Impossibile caricare le notizie al momento.
          </Alert>
        </Card.Body>
      )}

      {news && (
        <ListGroup variant="flush">
          {news.map((item) => (
            <ListGroup.Item
              key={item.id}
              as="a"
              href={item.link}
              target="_blank"
              rel="noreferrer"
              action
            >
              <p className="mb-0">{item.title}</p>
              <small className="text-muted">{item.meta}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  );
}

export default NewsSection;
