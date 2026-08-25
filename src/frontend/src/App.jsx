import { BrowserRouter, Route, Routes } from "react-router";
import DashboardPage from "./pages/dashBoardPage";
import ImportPage from "./pages/importPage";
import MatchesPage from "./pages/matchesPage";
import NotFound from "./pages/notFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ImportPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
