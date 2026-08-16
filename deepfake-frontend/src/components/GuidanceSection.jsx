import { useState } from "react";
import NextSteps from "./NextSteps";
import RiskAssessment from "./RiskAssessment";
import LegalGuidance from "./LegalGuidance";
import PlatformReporting from "./PlatformReporting";
import OrganizationResponse from "./OrganizationResponse";
import EvidenceReport from "./EvidenceReport";

const GuidanceSection = ({
  analysisData,
  isOrgMode,
  isImageAnalysis = false,
}) => {
  const [activeTab, setActiveTab] = useState("steps");

  // Determine the result for guidance - handle both single and batch results
  const getAnalysisResult = () => {
    if (analysisData.isBatch) {
      // For batch analysis, determine overall result
      const fakeCount = analysisData.summary?.fake_detected || 0;
      return fakeCount > 0 ? "FAKE" : "REAL";
    }
    return analysisData.result;
  };

  const analysisResult = getAnalysisResult();

  const tabs = [
    { id: "steps", label: "Next Steps", icon: "📋" },
    { id: "risk", label: "Risk Assessment", icon: "⚠️" },
    { id: "legal", label: "Legal Guidance", icon: "⚖️" },
    { id: "platforms", label: "Platform Reporting", icon: "📱" },
    ...(isOrgMode
      ? [{ id: "organization", label: "Organization Response", icon: "🏢" }]
      : []),
    { id: "evidence", label: "Evidence Report", icon: "📄" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "steps":
        return (
          <NextSteps
            result={analysisResult}
            isImageAnalysis={isImageAnalysis}
          />
        );
      case "risk":
        return <RiskAssessment isImageAnalysis={isImageAnalysis} />;
      case "legal":
        return <LegalGuidance isImageAnalysis={isImageAnalysis} />;
      case "platforms":
        return <PlatformReporting isImageAnalysis={isImageAnalysis} />;
      case "organization":
        return <OrganizationResponse isImageAnalysis={isImageAnalysis} />;
      case "evidence":
        return (
          <EvidenceReport
            analysisData={analysisData}
            isOrgMode={isOrgMode}
            isImageAnalysis={isImageAnalysis}
          />
        );
      default:
        return (
          <NextSteps
            result={analysisResult}
            isImageAnalysis={isImageAnalysis}
          />
        );
    }
  };

  return (
    <div className="guidance-section">
      <div className="guidance-header">
        <h2 className="guidance-title">Post-Detection Response Guidance</h2>
        <p className="guidance-subtitle">
          Comprehensive protocols and procedures for responding to{" "}
          {isImageAnalysis ? "image" : "video"} deepfake detection results.
          Follow these standardized steps to ensure appropriate action and
          evidence preservation.
        </p>
      </div>

      <div className="guidance-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="guidance-content">{renderTabContent()}</div>
    </div>
  );
};

export default GuidanceSection;
