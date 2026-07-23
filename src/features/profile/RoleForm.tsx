import { useState } from "react";
import type { SubmitEvent } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

export interface ExperienceFormData {
  role: string;
  company: string;
  period: string;
  description: string;
}

interface RoleFormProps {
  onAdd: (experience: ExperienceFormData) => void;
}

function RoleForm({ onAdd }: RoleFormProps) {
  const [form, setForm] = useState<ExperienceFormData>({
    role: "",
    company: "",
    period: "",
    description: "",
  });

  // Ora le esperienze finiscono su db.json: meglio non salvare righe vuote
  const isValid = form.role.trim() !== "" && form.company.trim() !== "";

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onAdd(form);
    setForm({ role: "", company: "", period: "", description: "" });
  };

  return (
    <Card className="border-0">
      <Card.Title className="mt-3 ps-3">Aggiungi esperienza</Card.Title>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Row className="g-2">
              <Col xs={12} md={6}>
                <Form.Control
                  type="text"
                  placeholder="Ruolo"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </Col>
              <Col xs={12} md={6}>
                <Form.Control
                  type="text"
                  placeholder="Azienda"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                />
              </Col>
              <Col xs={12} md={12}>
                <Form.Control
                  type="text"
                  placeholder="Periodo (es. 2024 - presente"
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                />
              </Col>
              <Col xs={12} md={12}>
                <Form.Control
                  as="textarea"
                  placeholder="Descrizione (facoltativa)"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Col>
            </Row>
          </Form.Group>
          <Button
            type="submit"
            className="d-block ms-auto mt-3"
            disabled={!isValid}
          >
            Aggiungi
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default RoleForm;
