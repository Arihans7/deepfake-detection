import { useState } from "react";
import ImageUpload from "./ImageUpload";
import ImageAnalysisResult from "./ImageAnalysisResult";
import GuidanceSection from "./GuidanceSection";

const ImageDetection = ({ activeTab, setActiveTab }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [isOrgMode, setIsOrgMode] = useState(false);

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
  };

  const handleReset = () => {
    setAnalysisData(null);
  };

  const toggleMode = () => {
    setIsOrgMode(!isOrgMode);
  };

  return (
    <div className="detection-section">
      <div className="detection-header">
        <div className="detection-controls-wrapper">
          <div className="mode-controls">
            <div className="mode-indicator">
              <span
                className={`mode-badge ${isOrgMode ? "organization" : "individual"}`}
              >
                {isOrgMode ? "Organization Mode" : "Individual Mode"}
              </span>
            </div>
            <button className="mode-toggle" onClick={toggleMode}>
              Switch to {isOrgMode ? "Individual" : "Organization"} Mode
            </button>
          </div>
          
          <div className="detection-type-controls">
            <button
              className={`detection-type-btn ${activeTab === "video" ? "active" : ""}`}
              onClick={() => setActiveTab("video")}
            >
              <span className="detection-type-icon">📹</span>
              <span className="detection-type-text">Video Detection</span>
            </button>
            <button
              className={`detection-type-btn ${activeTab === "image" ? "active" : ""}`}
              onClick={() => setActiveTab("image")}
            >
              <span className="detection-type-icon">🖼️</span>
              <span className="detection-type-text">Image Detection</span>
            </button>
          </div>
        </div>
      </div>

      <ImageUpload onAnalysisComplete={handleAnalysisComplete} />

      {analysisData && (
        <>
          <ImageAnalysisResult
            analysisData={analysisData}
            isOrgMode={isOrgMode}
          />
          <GuidanceSection
            analysisData={analysisData}
            isOrgMode={isOrgMode}
            isImageAnalysis={true}
          />
          <div className="reset-section">
            <button className="reset-btn" onClick={handleReset}>
              Analyze More Images
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageDetection;
