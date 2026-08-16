// API service for backend communication.
// Vite env variables let us deploy without changing source code.
const API_BASE_URL = import.meta.env.VITE_VIDEO_API_URL || "http://localhost:5000";
const IMAGE_API_BASE_URL = import.meta.env.VITE_IMAGE_API_URL || "http://localhost:5001";

const parseApiError = async (response, fallbackMessage) => {
  try {
    const error = await response.json();
    return error.error || fallbackMessage;
  } catch {
    return response.statusText || fallbackMessage;
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error("Backend health check failed");
    return await response.json();
  } catch {
    throw new Error("Unable to connect to the video analysis server");
  }
};

export const checkImageBackendHealth = async () => {
  try {
    const response = await fetch(`${IMAGE_API_BASE_URL}/api/health`);
    if (!response.ok) throw new Error("Image backend health check failed");
    return await response.json();
  } catch {
    throw new Error("Unable to connect to the image analysis server");
  }
};

export const uploadVideo = async (videoFile) => {
  const formData = new FormData();
  formData.append("video", videoFile);

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response, "Video analysis failed"));
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the video analysis server. Please ensure the backend is running."
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
      throw new Error(await parseApiError(response, "Image analysis failed"));
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the image analysis server. Please ensure the image backend is running."
      );
    }
    throw error;
  }
};

export const uploadBatchImages = async (imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach((file) => formData.append("files", file));

  try {
    const response = await fetch(`${IMAGE_API_BASE_URL}/api/predict_batch`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        await parseApiError(response, "Batch image analysis failed")
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Unable to connect to the image analysis server.");
    }
    throw error;
  }
};

export const calculateFileHash = async (file) => {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  } catch (error) {
    console.error("Hash calculation failed:", error);
    return "unavailable";
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, index)) * 100) / 100} ${sizes[index]}`;
};
