import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

function RedirectIfAuth() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RedirectIfAuth;
