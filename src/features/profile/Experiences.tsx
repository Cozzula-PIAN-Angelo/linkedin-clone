import { Button, Card, Spinner } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import type { Experience } from "../../types";
import { useAppDispatch } from "../../app/hooks";
import { deleteExperience } from "./profileSlice";

interface ExperiencesProps {
  experiences: Experience[];
  // Solo sul proprio profilo si possono eliminare le esperienze
  canEdit: boolean;
  loading: boolean;
}

function Experiences({ experiences, canEdit, loading }: ExperiencesProps) {
  const dispatch = useAppDispatch();

  if (loading) {
    return (
      <Card className="border-0">
        <Card.Title className="mt-3 ps-3">Esperienza</Card.Title>
        <Card.Body className="text-center">
          <Spinner animation="border" size="sm" />
        </Card.Body>
      </Card>
    );
  }

  if (experiences.length === 0) {
    return (
      <Card className="border-0">
        <Card.Title className="mt-3 ps-3">Esperienza</Card.Title>
        <Card.Body className="border border-muted rounded mb-3 mx-3">
          <Card.Subtitle className="text-center text-secondary">
            Nessuna esperienza inserita.
          </Card.Subtitle>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0">
      <Card.Title className="mt-3 ps-3">Esperienza</Card.Title>
      {experiences.map((exp) => (
        <Card.Body
          key={exp.id}
          className="border border-muted rounded mb-3 mx-3"
        >
          <div className="d-flex justify-content-between align-items-start">
            <Card.Title className="fw-semibold">{exp.role}</Card.Title>
            {canEdit && (
              <Button
                variant="link"
                size="sm"
                className="text-secondary p-0"
                title="Elimina esperienza"
                onClick={() => dispatch(deleteExperience(String(exp.id)))}
              >
                <Trash />
              </Button>
            )}
          </div>
          <Card.Subtitle className="text-secondary mb-2">
            {exp.company} · {exp.period}
          </Card.Subtitle>
          <Card.Text className="mb-0">{exp.description}</Card.Text>
        </Card.Body>
      ))}
    </Card>
  );
}

export default Experiences;
