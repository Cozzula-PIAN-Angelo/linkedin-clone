import { Routes, Route } from "react-router-dom";
import ProfilePage from "./features/profile/ProfilePage";

function App() {
  return (
    <Routes>
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
