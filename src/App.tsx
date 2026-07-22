import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import HomePage from "./pages/HomePage";
import type { RootState } from "./app/store";

function App() {
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </>
  );
}

export default App;
