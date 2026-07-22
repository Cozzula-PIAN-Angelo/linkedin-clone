import { Auth } from "./features/auth/auth"; //tolto momentaneamente il route perche dava errore e tolti i routes dentro l afunctionapp

function App() {
  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary fw-bold mb-4">LinkedIn Clone</h1>
      <Auth />
    </div>
  );
}

export default App;
