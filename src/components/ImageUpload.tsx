"use client";

import { useState, useRef, useCallback } from "react";
import styles from "@/styles/DocumentUpload.module.css";

interface ImageUploadProps {
  onImageUploaded: (imageData: { url: string; key: string }) => void;
  maxFiles?: number;
}

export default function ImageUpload({
  onImageUploaded,
  maxFiles = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return;

      setError("");
      setUploading(true);

      // Filter for image files only
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        setError("Please select valid image files (JPEG, PNG, GIF, WebP)");
        setUploading(false);
        return;
      }

      const uploadPromises = imageFiles.slice(0, maxFiles).map(async (file) => {
        const fileId = `${file.name}-${Date.now()}`;
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

        try {
          const formData = new FormData();
          formData.append("file", file);

          // Get admin token for authorization
          const adminToken = localStorage.getItem("adminToken");
          if (!adminToken) {
            throw new Error("Admin token not found. Please log in again.");
          }

          // Prepare headers with authorization
          const headers: HeadersInit = {
            Authorization: `Bearer ${adminToken}`,
          };

          const response = await fetch("/api/gallery/upload", {
            method: "POST",
            headers,
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Upload failed");
          }

          const data = await response.json();
          setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

          onImageUploaded({
            url: data.url,
            key: data.key,
          });

          return data;
        } catch (error) {
          console.error("Upload error:", error);
          setError(
            `Failed to upload ${file.name}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
          setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
          throw error;
        }
      });

      try {
        await Promise.all(uploadPromises);
      } catch (error) {
        // Error handling is done in individual promises
      } finally {
        setUploading(false);
        setUploadProgress({});
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [maxFiles, onImageUploaded]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  return (
    <div className={styles.uploadContainer}>
      <div
        className={`${styles.uploadArea} ${
          dragActive ? styles.dragActive : ""
        } ${uploading ? styles.uploading : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className={styles.fileInput}
        />

        <div className={styles.uploadContent}>
          {uploading ? (
            <div className={styles.uploadingState}>
              <div className={styles.spinner}></div>
              <p>Uploading images...</p>
            </div>
          ) : (
            <>
              <div className={styles.uploadIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="8.5"
                    cy="8.5"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M21 15l-5-5L5 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={styles.uploadText}>
                <strong>Click to upload images</strong> or drag and drop
              </p>
              <p className={styles.uploadSubtext}>
                Support for JPEG, PNG, GIF, WebP (max {maxFiles} files, 8MB
                each)
              </p>
            </>
          )}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {Object.keys(uploadProgress).length > 0 && (
        <div className={styles.progressContainer}>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className={styles.progressItem}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>{progress}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
