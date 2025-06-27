"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import styles from "@/styles/DocumentPreview.module.css";

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

interface DocumentPreviewProps {
  documents: Document[];
  showTitle?: boolean;
  maxDisplay?: number;
}

export default function DocumentPreview({
  documents,
  showTitle = true,
  maxDisplay = 5,
}: DocumentPreviewProps) {
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFileUrls = async () => {
      const urls: Record<string, string> = {};

      for (const doc of documents.slice(0, maxDisplay)) {
        try {
          const { data } = await supabase.storage
            .from("documents")
            .createSignedUrl(doc.file_path, 3600); // 1 hour expiry

          if (data?.signedUrl) {
            urls[doc.id] = data.signedUrl;
          }
        } catch (error) {
          console.error(`Error getting URL for ${doc.file_name}:`, error);
        }
      }

      setFileUrls(urls);
      setLoading(false);
    };

    if (documents.length > 0) {
      getFileUrls();
    } else {
      setLoading(false);
    }
  }, [documents, maxDisplay]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string, mimeType: string) => {
    if (fileType === "image") {
      return (
        <svg
          width="24"
          height="24"
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
          <polyline
            points="21,15 16,10 5,21"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
    } else if (fileType === "pdf") {
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="14,2 14,8 20,8"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="12" y="16" textAnchor="middle" fontSize="8" fill="#dc2626">
            PDF
          </text>
        </svg>
      );
    } else {
      return (
        <svg
          width="24"
          height="24"
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
        </svg>
      );
    }
  };

  const handleDownload = async (document: Document) => {
    const url = fileUrls[document.id];
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = window.document.createElement("a");
      link.href = downloadUrl;
      link.download = document.file_name;
      window.document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
      window.document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handlePreview = (document: Document) => {
    const url = fileUrls[document.id];
    if (!url) return;

    if (document.file_type === "image") {
      // Open image in modal or new tab
      window.open(url, "_blank");
    } else if (document.file_type === "pdf") {
      // Open PDF in new tab
      window.open(url, "_blank");
    } else {
      // For other file types, trigger download
      handleDownload(document);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <span>Loading documents...</span>
      </div>
    );
  }

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className={styles.previewContainer}>
      {showTitle && (
        <h4 className={styles.title}>Attachments ({documents.length})</h4>
      )}

      <div className={styles.documentsList}>
        {documents.slice(0, maxDisplay).map((doc) => (
          <div key={doc.id} className={styles.documentItem}>
            <div className={styles.documentInfo}>
              <div className={styles.fileIcon}>
                {getFileIcon(doc.file_type, doc.mime_type)}
              </div>

              <div className={styles.fileDetails}>
                <span className={styles.fileName}>
                  {doc.title || doc.file_name}
                </span>
                <span className={styles.fileSize}>
                  {formatFileSize(doc.file_size)}
                </span>
              </div>
            </div>

            <div className={styles.documentActions}>
              {doc.file_type === "image" || doc.file_type === "pdf" ? (
                <button
                  onClick={() => handlePreview(doc)}
                  className={styles.previewButton}
                  title="Preview"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : null}

              <button
                onClick={() => handleDownload(doc)}
                className={styles.downloadButton}
                title="Download"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="7,10 12,15 17,10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="15"
                    x2="12"
                    y2="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {documents.length > maxDisplay && (
          <div className={styles.moreDocuments}>
            +{documents.length - maxDisplay} more documents
          </div>
        )}
      </div>
    </div>
  );
}
