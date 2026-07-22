import type { ExperienceFormData } from "./RoleForm";
import { Card } from "react-bootstrap";

interface ExperenciesProps {
  experiences: (ExperienceFormData & { id: string })[];
}

function Experencies({ experiences }: ExperenciesProps) {
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
          <Card.Title className="fw-semibold">{exp.role}</Card.Title>
          <Card.Subtitle className="text-secondary mb-2">
            {exp.company} · {exp.period}
          </Card.Subtitle>
          <Card.Text className="mb-0">{exp.description}</Card.Text>
        </Card.Body>
      ))}
    </Card>
  );
}

export default Experencies;
