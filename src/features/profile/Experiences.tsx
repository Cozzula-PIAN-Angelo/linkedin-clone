import type { ExperienceFormData } from "./RoleForm";
import { Card } from "react-bootstrap";

interface ExperenciesProps {
  experiences: (ExperienceFormData & { id: string })[];
}

function Experencies({ experiences }: ExperenciesProps) {
  if (experiences.length === 0) {
    return (
      <Card>
        <Card.Title>Esperienza</Card.Title>
        <Card.Body className="border-1 text-secondary">
          Nessuna epserienza inserita.
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Title>Esperienza</Card.Title>
      {experiences.map((exp) => (
        <Card.Body key={exp.id}>
          <Card.Title>{exp.role}</Card.Title>
          <Card.Subtitle>{exp.company}</Card.Subtitle>
          <Card.Subtitle>{exp.period}</Card.Subtitle>
          <Card.Text>{exp.description}</Card.Text>
        </Card.Body>
      ))}
    </Card>
  );
}

export default Experencies;
