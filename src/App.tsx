import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import RedirectIfAuth from "./features/auth/RedirectIfAuth";
import ProfilePage from "./features/profile/ProfilePage";
import EditProfile from "./features/profile/EditProfile";
import NetworkPage from "./pages/NetworkPage";
import { useDummyNetwork } from "./features/network/useDummyNetwork";
import type { RootState } from "./app/store";

function App() {
  const theme = useSelector((state: RootState) => state.theme.mode);

  // Attività finta della rete (inviti in arrivo, accettazioni): vive qui
  // perché App è sempre montata, così i timer non muoiono cambiando pagina
  useDummyNetwork();

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return (
    <Routes>
      <Route element={<RedirectIfAuth />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        {/* Profilo di un altro utente ("edit" vince su ":id" per ranking) */}
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/network" element={<NetworkPage />} />
      </Route>
    </Routes>
  );
}

export default App;
