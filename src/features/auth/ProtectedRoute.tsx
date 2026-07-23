import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import Navbar from "../../components/navbar/Navbar";

function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAppSelector(
    (state) => state.auth,
  );

  // Firebase non ha ancora risposto se c'è una sessione attiva: aspetta
  // prima di decidere se reindirizzare, altrimenti si vedrebbe uno sbattimento
  // verso /login anche quando l'utente è già loggato
  if (initializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default ProtectedRoute;
