import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-content">
          <div className="nav-brand">
            <Link to="/" className="brand-link">
              <h2 className="brand-name">Deepfake Detection</h2>
            </Link>
          </div>

          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/detection"
              className={`nav-link ${location.pathname === "/detection" ? "active" : ""}`}
            >
              Detection
            </Link>
            <Link
              to="/awareness"
              className={`nav-link ${location.pathname === "/awareness" ? "active" : ""}`}
            >
              Awareness
            </Link>
            {location.pathname === "/" && (
              <button
                className="nav-link"
                onClick={() => scrollToSection("how-it-works")}
              >
                How It Works
              </button>
            )}
            <Link to="/detection" className="btn-primary btn-small">
              Upload Media
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
