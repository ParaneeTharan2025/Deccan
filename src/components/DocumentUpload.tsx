"use client";

import { useState, useRef, useCallback } from "react";
import styles from "@/styles/DocumentUpload.module.css";

interface Document {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  category: string;
}

interface DocumentUploadProps {
  onDocumentUploaded: (document: Document) => void;
  category?: string;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export default function DocumentUpload({
  onDocumentUploaded,
  category = "notices",
  maxFiles = 5,
  acceptedTypes = ["image/*", ".pdf", ".doc", ".docx", ".txt"],
}: DocumentUploadProps) {
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

      const uploadPromises = Array.from(files)
        .slice(0, maxFiles)
        .map(async (file) => {
          const fileId = `${file.name}-${Date.now()}`;
          setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

          try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", file.name.split(".")[0]);
            formData.append("category", category);

            // Get admin user ID from localStorage
            const adminToken = localStorage.getItem("adminToken");
            if (adminToken) {
              const payload = JSON.parse(atob(adminToken.split(".")[1]));
              formData.append("uploadedBy", payload.userId);
            }

            const response = await fetch("/api/documents/upload", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Upload failed");
            }

            const data = await response.json();
            setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

            onDocumentUploaded(data.document);

            return data.document;
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
    [category, maxFiles, onDocumentUploaded]
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className={styles.fileInput}
        />

        <div className={styles.uploadContent}>
          {uploading ? (
            <div className={styles.uploadingState}>
              <div className={styles.spinner}></div>
              <p>Uploading files...</p>
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
                  <path
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14,2 14,8 20,8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="18"
                    x2="12"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="9,15 12,12 15,15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={styles.uploadText}>
                <strong>Click to upload</strong> or drag and drop
              </p>
              <p className={styles.uploadSubtext}>
                Support for images, PDFs, and documents (max {maxFiles} files)
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
