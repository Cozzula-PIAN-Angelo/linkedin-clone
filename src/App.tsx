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
import PostPage from "./pages/PostPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useDummyNetwork } from "./features/network/useDummyNetwork";
import type { RootState } from "./app/store";
import { useCopy } from "./features/theme/copy";
import { themeConfigs } from "./features/theme/themeConfig";

function App() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const brandTheme = useSelector((state: RootState) => state.theme.brandTheme);
  const copy = useCopy();
  const Effects = themeConfigs[brandTheme].effects;

  // Attività finta della rete (inviti in arrivo, accettazioni): vive qui
  // perché App è sempre montata, così i timer non muoiono cambiando pagina
  useDummyNetwork();

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-brand-theme", brandTheme);
  }, [brandTheme]);

  useEffect(() => {
    document.title = copy.pageTitle;
  }, [copy.pageTitle]);

  return (
    <>
      {Effects && <Effects />}
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
          {/* Singolo post: è la destinazione del link condiviso con "Invia" */}
          <Route path="/post/:id" element={<PostPage />} />
          {/* URL inesistente: pagina 404 con la navbar (se non sei loggato
              ProtectedRoute ti manda comunque al login) */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
