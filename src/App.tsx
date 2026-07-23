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
import type { RootState } from "./app/store";
import { useCopy } from "./features/theme/copy";
import FantasyDust from "./components/FantasyDust";

function App() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const brandTheme = useSelector(
    (state: RootState) => state.theme.brandTheme,
  );
  const copy = useCopy();

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
      <FantasyDust />
      <Routes>
        <Route element={<RedirectIfAuth />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
