import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearError, registerUser } from "./authSlice";
import { useCopy } from "../theme/copy";

function RegisterForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const copy = useCopy();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [headline, setHeadline] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(
        registerUser({ name, surname, headline, email, password }),
      ).unwrap();
      navigate("/", { replace: true });
    } catch {
      // errore già disponibile in state.auth.error, mostrato dall'Alert sotto
    }
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert variant="danger" className="py-2 small">
          {error}
        </Alert>
      )}

      <div className="row">
        <Form.Group className="col-6 mb-3" controlId="registerName">
          <Form.Label className="text-muted small mb-1">Nome</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="col-6 mb-3" controlId="registerSurname">
          <Form.Label className="text-muted small mb-1">Cognome</Form.Label>
          <Form.Control
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </Form.Group>
      </div>

      <Form.Group className="mb-3" controlId="registerHeadline">
        <Form.Label className="text-muted small mb-1">
          Qualifica / Titolo
        </Form.Label>
        <Form.Control
          type="text"
          placeholder={copy.register.headlinePlaceholder}
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="registerEmail">
        <Form.Label className="text-muted small mb-1">Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="nome@email.it"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="registerPassword">
        <Form.Label className="text-muted small mb-1">Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button
        type="submit"
        variant="primary"
        className="w-100 rounded-pill fw-bold"
        disabled={loading}
      >
        {loading ? <Spinner animation="border" size="sm" /> : copy.register.submit}
      </Button>
    </Form>
  );
}

export default RegisterForm;
