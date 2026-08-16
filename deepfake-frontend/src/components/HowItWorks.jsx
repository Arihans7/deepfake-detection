import { useScrollAnimation } from "../hooks/useScrollAnimation";
import ScrollReveal from "./ScrollReveal";

const HowItWorks = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.15 });

  const steps = [
    {
      number: "01",
      title: "Upload Video",
      description: "Drag and drop or select your video file for analysis",
    },
    {
      number: "02",
      title: "AI Analysis",
      description:
        "Our MobileNetV2 model analyzes frames for deepfake indicators",
    },
    {
      number: "03",
      title: "Get Results",
      description: "Receive confidence scores and detailed detection report",
    },
    {
      number: "04",
      title: "Take Action",
      description:
        "Follow guided steps for reporting and evidence preservation",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className={`how-it-works ${sectionVisible ? "section-visible" : ""}`}
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
          How It Works
        </ScrollReveal>
        <p
          className={`section-subtitle ${sectionVisible ? "fade-in-up-delay" : ""}`}
        >
          Simple, secure, and accurate deepfake detection in four steps
        </p>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-card ${sectionVisible ? `fade-in-up-delay-${index + 1}` : ""}`}
            >
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
