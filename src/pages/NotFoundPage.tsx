import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCopy } from "../features/theme/copy";

// Catch-all per gli URL sbagliati: senza questa pagina la rotta inesistente
// mostrava soltanto una schermata bianca
function NotFoundPage() {
  const copy = useCopy();

  return (
    <Container className="mt-5 text-center">
      <div className="display-1 fw-bold text-secondary">404</div>
      <h1 className="h4 mt-2">{copy.notFound.title}</h1>
      <p className="text-secondary">{copy.notFound.message}</p>
      <Link to="/" className="btn btn-primary rounded-pill mt-2">
        {copy.notFound.backHome}
      </Link>
    </Container>
  );
}

export default NotFoundPage;
