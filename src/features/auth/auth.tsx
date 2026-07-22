//  🎨 REACT: Componente/Pagina visiva (Form Bootstrap di Login)

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, clearError } from "./authSlice";
import type { AppDispatch, RootState } from "../../app/store";

export function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);

  // controlled inputs per cambiare facilmente gli states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [title, setTitle] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegistering) {
      dispatch(registerUser({ email, password, name, surname, title }));
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  const toggleMode = () => {
    dispatch(clearError());
    setIsRegistering(!isRegistering);
  };

  if (isAuthenticated && currentUser) {
    return (
      <div className="alert alert-success text-center shadow-sm">
        <h4>
          Benvenuto, {currentUser.name} {currentUser.surname}!
        </h4>
        <p className="mb-0">Sei autenticato correttamente in LinkedIn Clone.</p>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-5">
        <div className="card shadow-sm p-4 border-0 rounded-3">
          <h3 className="h5 text-center fw-bold mb-3">
            {isRegistering ? "Iscriviti a LinkedIn" : "Accedi a LinkedIn"}
          </h3>

          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label text-muted small mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label text-muted small mb-1">
                      Cognome
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small mb-1">
                    Qualifica / Titolo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="es. Full Stack Developer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="form-label text-muted small mb-1">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="nome@email.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small mb-1">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 rounded-pill fw-bold mb-3"
              disabled={loading}
            >
              {loading
                ? "Caricamento..."
                : isRegistering
                  ? "Registrati"
                  : "Accedi"}
            </button>
          </form>

          <div className="text-center mt-2">
            <span className="small text-muted me-1">
              {isRegistering ? "Hai già un account?" : "Sei nuovo su LinkedIn?"}
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none fw-bold"
              onClick={toggleMode}
            >
              {isRegistering ? "Accedi" : "Iscriviti ora"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
