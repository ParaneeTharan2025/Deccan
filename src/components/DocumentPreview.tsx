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
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    document: Document | null;
    url: string;
  }>({
    isOpen: false,
    document: null,
    url: "",
  });

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

  const getFileIcon = (fileType: string) => {
    if (fileType === "image") {
      return "🖼️";
    } else if (fileType === "pdf") {
      return "📄";
    } else {
      return "📎";
    }
  };

  const handleAttachmentClick = (document: Document) => {
    const url = fileUrls[document.id];
    if (!url) return;

    if (document.file_type === "image" || document.file_type === "pdf") {
      setPreviewModal({
        isOpen: true,
        document,
        url,
      });
    } else {
      // For other file types, trigger download
      handleDownload(document);
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

  const closeModal = () => {
    setPreviewModal({
      isOpen: false,
      document: null,
      url: "",
    });
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
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
    <>
      <div className={styles.attachmentsList}>
        {documents.slice(0, maxDisplay).map((doc, index) => (
          <span key={doc.id}>
            <button
              onClick={() => handleAttachmentClick(doc)}
              className={styles.attachmentLink}
              title={`${doc.title || doc.file_name} (${formatFileSize(
                doc.file_size
              )})`}
            >
              {getFileIcon(doc.file_type)} {doc.title || doc.file_name}
            </button>
            {index < Math.min(documents.length, maxDisplay) - 1 && (
              <span className={styles.separator}>, </span>
            )}
          </span>
        ))}

        {documents.length > maxDisplay && (
          <span className={styles.moreAttachments}>
            , +{documents.length - maxDisplay} more
          </span>
        )}
      </div>

      {/* Preview Modal */}
      {previewModal.isOpen && previewModal.document && (
        <div className={styles.modalOverlay} onClick={handleModalBackdropClick}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {previewModal.document.title || previewModal.document.file_name}
              </h3>
              <button
                onClick={closeModal}
                className={styles.modalCloseButton}
                title="Close"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {previewModal.document.file_type === "image" ? (
                <img
                  src={previewModal.url}
                  alt={previewModal.document.file_name}
                  className={styles.previewImage}
                />
              ) : previewModal.document.file_type === "pdf" ? (
                <iframe
                  src={previewModal.url}
                  className={styles.previewPdf}
                  title={previewModal.document.file_name}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
