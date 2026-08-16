import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import LetterGlitch from "./LetterGlitch";

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="hero">
      <div className="hero-background">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>
      <div className="hero-content">
        <h1
          ref={titleRef}
          className={`hero-title ${mounted ? "hero-title-visible" : ""}`}
        >
          Advanced Deepfake Detection Platform
        </h1>
        <p
          ref={subtitleRef}
          className={`hero-subtitle ${mounted ? "hero-subtitle-visible" : ""}`}
        >
          AI-powered video and image analysis with comprehensive post-detection
          guidance and legal support
        </p>
        <div
          ref={actionsRef}
          className={`hero-actions ${mounted ? "hero-actions-visible" : ""}`}
        >
          <Link to="/detection" className="btn-primary">
            Upload Media
          </Link>
          <button
            className="btn-secondary"
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            How It Works
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
