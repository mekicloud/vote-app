import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import VotePage from "./pages/VotePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/vote" element={<VotePage />} />
    </Routes>
  );
}
export default App;