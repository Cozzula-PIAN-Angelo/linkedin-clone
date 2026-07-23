import { Alert, Card, ListGroup, Spinner } from "react-bootstrap";
import { useGetLatestNewsQuery } from "./newsApi";
import { useCopy } from "../theme/copy";

function NewsSection() {
  const { data: news, isLoading, isError } = useGetLatestNewsQuery();
  const copy = useCopy();

  return (
    <Card as="aside" aria-label={copy.news.title}>
      <Card.Body>
        <Card.Title as="h2" className="h6 mb-0">
          {copy.news.title}
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
            {copy.news.error}
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
              className="d-flex align-items-start gap-2"
            >
              {item.imageURL && (
                <img
                  src={item.imageURL}
                  alt=""
                  width={56}
                  height={56}
                  className="rounded object-fit-cover flex-shrink-0"
                />
              )}
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <p className="mb-0 text-truncate" title={item.title}>
                  {item.title}
                </p>
                <small className="text-muted">{item.meta}</small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  );
}

export default NewsSection;
