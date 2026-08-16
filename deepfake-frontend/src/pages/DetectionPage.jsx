import { useState } from "react";
import Detection from "../components/Detection";
import ImageDetection from "../components/ImageDetection";
import LetterGlitch from "../components/LetterGlitch";

const DetectionPage = () => {
  const [activeTab, setActiveTab] = useState("video");

  return (
    <div className="page-container detection-page">
      {/* Hero Section */}
      <section className="detection-hero">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
        <div className="container">
          <div className="detection-hero-content">
            <h1 className="detection-hero-title">Deepfake Detection</h1>
            <p className="detection-hero-subtitle">
              Upload and analyze videos or images using advanced AI technology.
              Get instant results with comprehensive guidance and legal support.
            </p>
          </div>
        </div>
      </section>

      {/* Detection Content */}
      <section className="page-content">
        <div className="container">
          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "video" && (
              <Detection activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
            {activeTab === "image" && (
              <ImageDetection activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetectionPage;
