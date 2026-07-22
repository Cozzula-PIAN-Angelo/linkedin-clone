import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import HomePage from "./pages/HomePage";
//import { Auth } from "./features/auth/auth"; //tolto momentaneamente il route perche dava errore e tolti i routes dentro l afunctionapp

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/*<Route path="/auth" element={<Auth />} /> */}
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </>
  );
}

export default App;
