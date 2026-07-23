import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearError, loginUser } from "./authSlice";
import { useCopy } from "../theme/copy";

function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const copy = useCopy();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
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

      <Form.Group className="mb-3" controlId="loginEmail">
        <Form.Label className="text-muted small mb-1">Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="nome@email.it"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="loginPassword">
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
        {loading ? <Spinner animation="border" size="sm" /> : copy.login.submit}
      </Button>
    </Form>
  );
}

export default LoginForm;
