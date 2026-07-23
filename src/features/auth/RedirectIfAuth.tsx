import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

function RedirectIfAuth() {
  const { isAuthenticated, initializing } = useAppSelector(
    (state) => state.auth,
  );

  if (initializing) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RedirectIfAuth;
