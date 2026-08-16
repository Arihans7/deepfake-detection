import { useState } from "react";
import { formatFileSize } from "../services/api";

const ImageAnalysisResult = ({ analysisData, isOrgMode }) => {
  const [selectedResult, setSelectedResult] = useState(null);

  if (!analysisData) return null;

  const renderSingleResult = (data) => {
    const isDeepfake = data.result === "FAKE";
    const confidenceColor =
      data.confidence >= 80
        ? "#e74c3c"
        : data.confidence >= 60
          ? "#f39c12"
          : "#27ae60";

    return (
      <div className="analysis-result">
        <div className="result-header">
          <div className={`result-badge ${isDeepfake ? "fake" : "real"}`}>
            {isDeepfake ? "⚠️ DEEPFAKE DETECTED" : "✅ AUTHENTIC IMAGE"}
          </div>
          <div className="confidence-score" style={{ color: confidenceColor }}>
            {data.confidence}% Confidence
          </div>
        </div>

        <div className="result-content">
          <div className="image-preview">
            <img
              src={URL.createObjectURL(data.file)}
              alt="Analyzed image"
              className="analyzed-image"
            />
          </div>

          <div className="result-details">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">File Name:</span>
                <span className="detail-value">{data.file.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">File Size:</span>
                <span className="detail-value">
                  {formatFileSize(data.file.size)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Analysis Time:</span>
                <span className="detail-value">
                  {data.timestamp.toLocaleString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Raw Score:</span>
                <span className="detail-value">
                  {data.rawScore?.toFixed(4) || "N/A"}
                </span>
              </div>
              {isOrgMode && (
                <div className="detail-item">
                  <span className="detail-label">File Hash:</span>
                  <span className="detail-value hash-value">
                    {data.fileHash}
                  </span>
                </div>
              )}
            </div>

            <div className="confidence-bar">
              <div className="confidence-label">Confidence Level</div>
              <div className="confidence-track">
                <div
                  className="confidence-fill"
                  style={{
                    width: `${data.confidence}%`,
                    backgroundColor: confidenceColor,
                  }}
                ></div>
              </div>
              <div className="confidence-text">{data.confidence}%</div>
            </div>
          </div>
        </div>

        {isDeepfake && (
          <div className="warning-section">
            <div className="warning-header">
              <span className="warning-icon">⚠️</span>
              <span className="warning-title">Deepfake Detection Alert</span>
            </div>
            <p className="warning-text">
              This image has been identified as potentially manipulated or
              artificially generated. Please verify the source and consider the
              implications before sharing or using this content.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderBatchResults = (data) => {
    const { results, summary } = data;
    const fakeCount = summary?.fake_detected || 0;
    const realCount = summary?.real_detected || 0;
    const totalCount = summary?.total_files || results.length;

    return (
      <div className="batch-analysis-result">
        <div className="batch-header">
          <h3 className="batch-title">Batch Analysis Results</h3>
          <div className="batch-summary">
            <div className="summary-stats">
              <div className="stat-item">
                <div className="stat-number">{totalCount}</div>
                <div className="stat-label">Total Images</div>
              </div>
              <div className="stat-item real">
                <div className="stat-number">{realCount}</div>
                <div className="stat-label">Authentic</div>
              </div>
              <div className="stat-item fake">
                <div className="stat-number">{fakeCount}</div>
                <div className="stat-label">Deepfakes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="batch-results-grid">
          {results.map((result, index) => {
            if (result.error) {
              return (
                <div key={index} className="result-card error">
                  <div className="result-thumbnail">
                    <div className="error-icon">❌</div>
                  </div>
                  <div className="result-info">
                    <div className="result-filename">{result.filename}</div>
                    <div className="result-error">Error: {result.error}</div>
                  </div>
                </div>
              );
            }

            const isDeepfake = result.prediction === "FAKE";
            const confidence = Math.round(result.confidence * 100);

            return (
              <div
                key={index}
                className={`result-card ${isDeepfake ? "fake" : "real"}`}
                onClick={() => setSelectedResult(result)}
              >
                <div className="result-thumbnail">
                  <img
                    src={URL.createObjectURL(result.file)}
                    alt={result.file.name}
                  />
                  <div
                    className={`result-overlay ${isDeepfake ? "fake" : "real"}`}
                  >
                    <div className="result-status">
                      {isDeepfake ? "FAKE" : "REAL"}
                    </div>
                    <div className="result-confidence">{confidence}%</div>
                  </div>
                </div>
                <div className="result-info">
                  <div className="result-filename">{result.file.name}</div>
                  <div className="result-details">
                    <span
                      className={`result-badge ${isDeepfake ? "fake" : "real"}`}
                    >
                      {isDeepfake ? "Deepfake" : "Authentic"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {fakeCount > 0 && (
          <div className="batch-warning">
            <div className="warning-header">
              <span className="warning-icon">⚠️</span>
              <span className="warning-title">
                {fakeCount} Deepfake{fakeCount > 1 ? "s" : ""} Detected
              </span>
            </div>
            <p className="warning-text">
              Some images in this batch have been identified as potentially
              manipulated. Review individual results and verify sources before
              use.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Modal for detailed view of batch results
  const renderDetailModal = () => {
    if (!selectedResult) return null;

    const isDeepfake = selectedResult.prediction === "FAKE";
    const confidence = Math.round(selectedResult.confidence * 100);

    return (
      <div className="modal-overlay" onClick={() => setSelectedResult(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Detailed Analysis</h3>
            <button
              className="modal-close"
              onClick={() => setSelectedResult(null)}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            {renderSingleResult({
              ...selectedResult,
              result: selectedResult.prediction,
              confidence: confidence,
              rawScore: selectedResult.raw_score,
              timestamp: analysisData.timestamp,
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="analysis-section">
        {analysisData.isBatch
          ? renderBatchResults(analysisData)
          : renderSingleResult(analysisData)}
      </div>
      {renderDetailModal()}
    </>
  );
};

export default ImageAnalysisResult;
