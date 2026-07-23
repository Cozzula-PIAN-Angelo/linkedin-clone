import { useEffect } from "react";
import { useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
import { useCopy } from "./features/theme/copy";
import { themeConfigs } from "./features/theme/themeConfig";
import { auth, db } from "./firebase";
import { authStateResolved } from "./features/auth/authSlice";
import { useAppDispatch } from "./app/hooks";
import type { RootState } from "./app/store";
import type { User } from "./types";
import FantasyDust from "./components/FantasyDust";

function App() {
  const dispatch = useAppDispatch();
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

  // Firebase legge la sessione salvata (IndexedDB) in modo asincrono: questo
  // listener scatta al primo avvio e ad ogni login/logout, e sincronizza
  // Redux con l'utente (Auth + profilo Firestore) effettivamente loggato.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        dispatch(authStateResolved(null));
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        const profile = snap.exists()
          ? ({ id: firebaseUser.uid, ...snap.data() } as User)
          : null;
        dispatch(authStateResolved(profile));
      } catch {
        dispatch(authStateResolved(null));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <>
      {Effects && <Effects />}
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
