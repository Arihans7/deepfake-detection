import { useState, useRef } from "react";
import {
  uploadImage,
  uploadBatchImages,
  calculateFileHash,
  formatFileSize,
} from "../services/api";

const ImageUpload = ({ onAnalysisComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    const validFiles = [];
    let hasError = false;

    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Please select valid image files only");
        hasError = true;
        break;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Each image must be less than 10MB");
        hasError = true;
        break;
      }

      validFiles.push(file);
    }

    if (!hasError) {
      setError("");
      setSelectedFiles(validFiles);

      // Auto-enable batch mode if multiple files selected
      if (validFiles.length > 1) {
        setIsBatchMode(true);
      }
    }
  };

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) return;

    setIsAnalyzing(true);
    setError("");

    try {
      let result;

      if (isBatchMode && selectedFiles.length > 1) {
        // Batch analysis
        result = await uploadBatchImages(selectedFiles);

        // Process batch results
        const processedResults = result.results.map((res, index) => ({
          ...res,
          file: selectedFiles[index],
          fileHash: "batch-" + index,
        }));

        onAnalysisComplete({
          isBatch: true,
          results: processedResults,
          summary: result.summary,
          timestamp: new Date(),
        });
      } else {
        // Single image analysis
        const file = selectedFiles[0];
        result = await uploadImage(file);
        const fileHash = await calculateFileHash(file);

        // Calculate confidence based on result
        let confidenceScore = Math.round(result.confidence * 100);

        onAnalysisComplete({
          isBatch: false,
          result: result.prediction,
          confidence: confidenceScore,
          rawScore: result.raw_score,
          file: file,
          fileHash,
          timestamp: new Date(),
        });
      }
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
    handleFileSelect(Array.from(e.dataTransfer.files));
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setError("");
    setIsBatchMode(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);

    if (newFiles.length <= 1) {
      setIsBatchMode(false);
    }
  };

  return (
    <div className="upload-section">
      <div className="upload-mode-toggle">
        <button
          className={`mode-btn ${!isBatchMode ? "active" : ""}`}
          onClick={() => setIsBatchMode(false)}
          disabled={selectedFiles.length > 1}
        >
          Single Image
        </button>
        <button
          className={`mode-btn ${isBatchMode ? "active" : ""}`}
          onClick={() => setIsBatchMode(true)}
        >
          Batch Analysis
        </button>
      </div>

      <div
        className={`upload-area ${isDragOver ? "drag-over" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">🖼️</div>
        <div className="upload-text">
          {isBatchMode
            ? "Click or drag images here"
            : "Click or drag image here"}
        </div>
        <div className="upload-subtext">
          Supports JPG, PNG, GIF, BMP (Max 10MB each)
          {isBatchMode && " • Multiple files supported"}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={isBatchMode}
          onChange={(e) => handleFileSelect(Array.from(e.target.files))}
          style={{ display: "none" }}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="files-info">
          <div className="files-header">
            <span className="files-count">
              {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}{" "}
              selected
            </span>
            <button className="reset-files-btn" onClick={handleReset}>
              Clear All
            </button>
          </div>

          <div className="files-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-preview">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="file-thumbnail"
                  />
                </div>
                <div className="file-details">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{formatFileSize(file.size)}</div>
                </div>
                <button
                  className="remove-file-btn"
                  onClick={() => removeFile(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="spinner"></div>
              {isBatchMode && selectedFiles.length > 1
                ? `Analyzing ${selectedFiles.length} images...`
                : "Analyzing image..."}
            </>
          ) : (
            <>
              {isBatchMode && selectedFiles.length > 1
                ? `Analyze ${selectedFiles.length} Images`
                : "Analyze Image"}
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
