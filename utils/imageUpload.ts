
// utils/imageUpload.ts
import { useState } from "react";

export interface UploadResponse {
  urls: string[];
  message: string;
  count: number;
}

// Main utility function for uploading images
export const uploadImages = async (files: File[]): Promise<UploadResponse> => {
  if (files.length === 0) {
    throw new Error("No files provided");
  }

  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("/api/upload-images", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    const data: UploadResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Utility to validate image files before upload
export const validateImageFiles = (
  files: File[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (files.length === 0) {
    errors.push("No files selected");
  }

  files.forEach((file, index) => {
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      errors.push(
        `File ${index + 1}: Invalid type ${
          file.type
        }. Allowed: JPG, PNG, GIF, WebP`
      );
    }

    if (file.size > maxSize) {
      errors.push(
        `File ${index + 1}: Too large (${Math.round(
          file.size / 1024 / 1024
        )}MB). Max: 5MB`
      );
    }

    if (file.size === 0) {
      errors.push(`File ${index + 1}: Empty file`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

// React Hook for image upload
export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const upload = async (files: File[]): Promise<UploadResponse> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const validation = validateImageFiles(files);
      if (!validation.valid) {
        throw new Error(validation.errors.join("; "));
      }

      setProgress(50);
      const result = await uploadImages(files);
      setProgress(100);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setError(null);
    setProgress(0);
  };

  return {
    upload,
    uploading,
    error,
    progress,
    reset,
  };
};

// Helper function to create file preview URLs
export const createPreviewUrls = (files: File[]): string[] => {
  return files.map((file) => URL.createObjectURL(file));
};

// Helper function to cleanup preview URLs
export const cleanupPreviewUrls = (urls: string[]): void => {
  urls.forEach((url) => URL.revokeObjectURL(url));
};

// File size formatter
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
