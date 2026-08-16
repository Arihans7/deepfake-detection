// API service for backend communication
const API_BASE_URL = "http://localhost:5000";
const IMAGE_API_BASE_URL = "http://localhost:5001";

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error("Backend health check failed");
  } catch (error) {
    throw new Error("Unable to connect to backend server");
  }
};

export const checkImageBackendHealth = async () => {
  try {
    const response = await fetch(`${IMAGE_API_BASE_URL}/api/health`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error("Image backend health check failed");
  } catch (error) {
    throw new Error("Unable to connect to image backend server");
  }
};

export const uploadVideo = async (videoFile) => {
  const formData = new FormData();
  formData.append("video", videoFile);

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type header - let browser set it with boundary for FormData
      },
    });

    if (!response.ok) {
      let errorMessage = "Analysis failed";
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to the analysis server. Please ensure the backend is running on http://localhost:5000",
      );
    }
    throw error;
  }
};

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await fetch(`${IMAGE_API_BASE_URL}/api/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Image analysis failed";
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to the image analysis server. Please ensure the image backend is running on http://localhost:5001",
      );
    }
    throw error;
  }
};

export const uploadBatchImages = async (imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await fetch(`${IMAGE_API_BASE_URL}/api/predict_batch`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Batch image analysis failed";
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to the image analysis server. Please ensure the image backend is running on http://localhost:5001",
      );
    }
    throw error;
  }
};

export const calculateFileHash = async (file) => {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (error) {
    console.error("Hash calculation failed:", error);
    return "unavailable";
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
