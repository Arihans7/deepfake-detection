import { Link } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import ScrollReveal from "./ScrollReveal";

const CallToAction = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className={`cta ${sectionVisible ? "section-visible" : ""}`}
    >
      <div className="container">
        <div className="cta-content">
          <ScrollReveal
            baseOpacity={0.6}
            enableBlur
            baseRotation={2}
            blurStrength={3}
            containerClassName="cta-title-wrapper"
            textClassName="cta-title-scroll"
          >
            Ready to Detect Deepfakes?
          </ScrollReveal>
          <p
            className={`cta-subtitle ${sectionVisible ? "fade-in-up-delay" : ""}`}
          >
            Upload your video and get instant AI-powered analysis with
            comprehensive guidance
          </p>
          <Link
            to="/detection"
            className={`btn-primary btn-large ${sectionVisible ? "fade-in-up-delay-2" : ""}`}
          >
            Start Detection Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
