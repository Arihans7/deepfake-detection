import { useState, useRef } from "react";
import {
  uploadVideo,
  calculateFileHash,
  formatFileSize,
} from "../services/api";

const VideoUpload = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100MB");
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const fileHash = await calculateFileHash(selectedFile);
      const result = await uploadVideo(selectedFile);

      // Calculate confidence based on result
      let confidenceScore;
      if (result.result === "REAL") {
        confidenceScore = 95;
      } else if (result.result === "FAKE") {
        confidenceScore = 92;
      } else {
        confidenceScore = 50;
      }

      onAnalysisComplete({
        result: result.result,
        confidence: confidenceScore,
        file: selectedFile,
        fileHash,
        timestamp: new Date(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="upload-section">
      <div
        className={`upload-area ${isDragOver ? "drag-over" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">📹</div>
        <div className="upload-text">Click or drag video here</div>
        <div className="upload-subtext">Supports MP4, AVI, MOV (Max 100MB)</div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          style={{ display: "none" }}
        />
      </div>

      {selectedFile && (
        <div className="file-info">
          <div className="file-name">{selectedFile.name}</div>
          <div className="file-size">{formatFileSize(selectedFile.size)}</div>
          <button className="reset-file-btn" onClick={handleReset}>
            Remove
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {selectedFile && (
        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="spinner"></div>
              Analyzing video...
            </>
          ) : (
            "Analyze Video"
          )}
        </button>
      )}
    </div>
  );
};

export default VideoUpload;
