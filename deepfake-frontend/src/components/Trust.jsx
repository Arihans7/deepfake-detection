import { useScrollAnimation } from "../hooks/useScrollAnimation";
import ScrollReveal from "./ScrollReveal";

const Trust = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={sectionRef}
      className={`trust ${sectionVisible ? "section-visible" : ""}`}
    >
      <div className="container">
        <ScrollReveal
          baseOpacity={0.6}
          enableBlur
          baseRotation={2}
          blurStrength={3}
          containerClassName="section-title-wrapper"
          textClassName="section-title-scroll"
        >
          Responsible AI Detection
        </ScrollReveal>
        <div className="trust-content">
          <div
            className={`trust-item ${sectionVisible ? "fade-in-up-delay-1" : ""}`}
          >
            <h3 className="trust-subtitle">Probabilistic Analysis</h3>
            <p className="trust-text">
              Our AI provides confidence scores, not absolute certainty. Results
              should be used as guidance alongside human judgment and additional
              verification methods.
            </p>
          </div>

          <div
            className={`trust-item ${sectionVisible ? "fade-in-up-delay-2" : ""}`}
          >
            <h3 className="trust-subtitle">Privacy First</h3>
            <p className="trust-text">
              Videos are processed locally and deleted immediately after
              analysis. No data is stored permanently or shared with third
              parties.
            </p>
          </div>

          <div
            className={`trust-item ${sectionVisible ? "fade-in-up-delay-3" : ""}`}
          >
            <h3 className="trust-subtitle">Ethical Usage</h3>
            <p className="trust-text">
              This platform is designed for protection and education. We provide
              clear guidance on responsible use and legal reporting channels.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
