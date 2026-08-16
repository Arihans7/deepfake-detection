import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import GlobalClickSpark from "./components/GlobalClickSpark";
import HomePage from "./pages/HomePage";
import DetectionPage from "./pages/DetectionPage";
import AwarenessPage from "./pages/AwarenessPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <GlobalClickSpark
          sparkColor="#61dca3"
          sparkSize={10}
          sparkRadius={18}
          sparkCount={8}
          duration={450}
        />
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detection" element={<DetectionPage />} />
            <Route path="/awareness" element={<AwarenessPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
