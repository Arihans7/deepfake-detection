import { useRef, useState } from "react";
import { uploadVideo, calculateFileHash, formatFileSize } from "../services/api";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const VideoUpload = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 100 MB.");
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
      const [fileHash, response] = await Promise.all([
        calculateFileHash(selectedFile),
        uploadVideo(selectedFile),
      ]);

      const result = response?.result;
      if (!result || !result.label) {
        throw new Error("The analysis server returned an invalid result.");
      }

      onAnalysisComplete({
        ...result,
        result: result.label,
        file: selectedFile,
        fileHash,
        timestamp: new Date(),
      });
    } catch (err) {
      setError(err.message || "Unable to analyze this video.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    handleFileSelect(event.dataTransfer.files[0]);
  };

  const handleReset = (event) => {
    event?.stopPropagation();
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="upload-section">
      <div
        className={`upload-area ${isDragOver ? "drag-over" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            fileInputRef.current?.click();
          }
        }}
      >
        <div className="upload-icon">📹</div>
        <div className="upload-text">
          {isDragOver ? "Drop your video here" : "Click or drag video here"}
        </div>
        <div className="upload-subtext">
          Supports MP4, AVI, MOV, MKV, WEBM · Max 100 MB
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={(event) => handleFileSelect(event.target.files?.[0])}
          style={{ display: "none" }}
        />
      </div>

      {selectedFile && (
        <div className="file-info">
          <div>
            <div className="file-name">{selectedFile.name}</div>
            <div className="file-size">{formatFileSize(selectedFile.size)}</div>
          </div>
          <button type="button" className="reset-file-btn" onClick={handleReset}>
            Remove
          </button>
        </div>
      )}

      {error && (
        <div className="error-message" role="alert">
          <strong>Analysis error:</strong> {error}
        </div>
      )}

      {selectedFile && (
        <button
          type="button"
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="spinner" aria-hidden="true" />
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
