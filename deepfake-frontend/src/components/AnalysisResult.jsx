import { useState } from "react";

const AnalysisResult = ({ analysisData, isOrgMode }) => {
  const { result, confidence, file, fileHash, timestamp } = analysisData;

  const getResultDisplay = () => {
    if (result === "REAL") {
      return {
        icon: "✓",
        title: "Analysis Result: Authentic Content",
        description: "The AI analysis indicates this video appears to be authentic and not manipulated. However, automated detection systems are not infallible. Consider source verification and context when making decisions.",
        className: "real",
      };
    } else if (result === "FAKE") {
      return {
        icon: "✗",
        title: "Analysis Result: Potential Deepfake Detected",
        description:
          "The AI analysis indicates this video contains patterns consistent with synthetic or manipulated content (deepfake). Review the post-detection guidance for recommended response procedures.",
        className: "fake",
      };
    } else {
      return {
        icon: "?",
        title: "Analysis Result: Inconclusive",
        description: "The system could not confidently determine the authenticity of this video. This may be due to video quality, lack of detectable faces, or technical limitations. Consider expert analysis if this content is of concern.",
        className: "unsure",
      };
    }
  };

  const resultDisplay = getResultDisplay();

  return (
    <div className={`analysis-result ${resultDisplay.className}`}>
      <div className="result-header">
        <div className="result-icon">{resultDisplay.icon}</div>
        <div className="result-content">
          <h2 className="result-title">{resultDisplay.title}</h2>
          <p className="result-description">{resultDisplay.description}</p>
        </div>
      </div>

      <div className="confidence-section">
        <div className="confidence-label">Confidence Level</div>
        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
        <div className="confidence-value">{confidence}%</div>
      </div>

      <div className="analysis-metadata">
        <div className="metadata-item">
          <span className="metadata-label">File Name:</span>
          <span className="metadata-value">{file.name}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">File Size:</span>
          <span className="metadata-value">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Analysis Date:</span>
          <span className="metadata-value">{timestamp.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">File Hash (SHA-256):</span>
          <span className="metadata-value hash-value">{fileHash.substring(0, 16)}...</span>
        </div>
        {isOrgMode && (
          <div className="metadata-item">
            <span className="metadata-label">Analysis Mode:</span>
            <span className="metadata-value">Organization</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
