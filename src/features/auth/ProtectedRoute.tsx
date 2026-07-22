import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import Navbar from "../../components/navbar/Navbar";

function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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
