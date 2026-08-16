import { useScrollAnimation } from "../hooks/useScrollAnimation";
import ScrollReveal from "./ScrollReveal";

const Features = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.1 });

  const features = [
    {
      title: "AI-Powered Detection",
      description:
        "Advanced MobileNetV2 and MTCNN models for accurate deepfake identification with confidence scoring",
    },
    {
      title: "Real-time Processing",
      description:
        "Instant video analysis with immediate results and comprehensive detection reports",
    },
    {
      title: "Legal Guidance",
      description:
        "Jurisdiction-specific reporting instructions and official cybercrime portal connections",
    },
    {
      title: "Evidence Preservation",
      description:
        "Professional PDF report generation with file hashes for legal documentation",
    },
    {
      title: "Privacy Protection",
      description:
        "Videos processed in memory only - no permanent storage or third-party sharing",
    },
    {
      title: "Organization Mode",
      description:
        "Enterprise incident response protocols with stakeholder notification systems",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className={`features ${sectionVisible ? "section-visible" : ""}`}
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
          Platform Features
        </ScrollReveal>
        <p
          className={`section-subtitle ${sectionVisible ? "fade-in-up-delay" : ""}`}
        >
          Comprehensive deepfake detection with industry-leading accuracy and
          support
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card ${sectionVisible ? `fade-in-up-delay-${index % 3 + 1}` : ""}`}
            >
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
