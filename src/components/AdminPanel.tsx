"use client";

import { FormEvent, useState, useEffect } from "react";
import DocumentUpload from "./DocumentUpload";
import DocumentPreview from "./DocumentPreview";
import styles from "@/styles/AdminPanel.module.css";

interface DocumentData {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  category: string;
}

interface Notification {
  id: string;
  title: string;
  content: string;
  category: string;
  is_published: boolean;
  created_at: string;
  documents?: DocumentData[];
}

export default function AdminPanel() {
  const [notificationData, setNotificationData] = useState({
    title: "",
    content: "",
    category: "general",
    is_published: true,
  });
  const [attachedDocuments, setAttachedDocuments] = useState<DocumentData[]>(
    []
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");

  useEffect(() => {
    if (activeTab === "list") {
      fetchNotifications();
    }
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("/api/admin/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const requestData = {
        ...notificationData,
        document_ids: attachedDocuments.map((doc) => doc.id),
      };

      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const newNotification = await response.json();
        setNotifications((prev) => [newNotification, ...prev]);

        // Reset form
        setNotificationData({
          title: "",
          content: "",
          category: "general",
          is_published: true,
        });
        setAttachedDocuments([]);

        alert("Notification created successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create notification");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUploaded = (document: DocumentData) => {
    setAttachedDocuments((prev) => [...prev, document]);
  };

  const handleRemoveDocument = (documentId: string) => {
    setAttachedDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch(
        `/api/admin/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.adminPanel}>
      <div className={styles.header}>
        <h2>Admin Panel</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "create" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("create")}
          >
            Create Notification
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "list" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("list")}
          >
            All Notifications
          </button>
        </div>
      </div>

      {activeTab === "create" && (
        <div className={styles.createSection}>
          <form onSubmit={handleSubmit} className={styles.notificationForm}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="title">Notification Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={notificationData.title}
                onChange={(e) =>
                  setNotificationData({
                    ...notificationData,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                rows={4}
                value={notificationData.content}
                onChange={(e) =>
                  setNotificationData({
                    ...notificationData,
                    content: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={notificationData.category}
                onChange={(e) =>
                  setNotificationData({
                    ...notificationData,
                    category: e.target.value,
                  })
                }
              >
                <option value="general">General</option>
                <option value="important">Important</option>
                <option value="events">Events</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={notificationData.is_published}
                  onChange={(e) =>
                    setNotificationData({
                      ...notificationData,
                      is_published: e.target.checked,
                    })
                  }
                />
                Publish immediately
              </label>
            </div>

            <div className={styles.formGroup}>
              <label>Documents</label>
              <DocumentUpload
                onDocumentUploaded={handleDocumentUploaded}
                category="notices"
                maxFiles={3}
              />

              {attachedDocuments.length > 0 && (
                <div className={styles.attachedDocuments}>
                  <h4>Attached Documents:</h4>
                  {attachedDocuments.map((doc) => (
                    <div key={doc.id} className={styles.attachedDocument}>
                      <span>{doc.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(doc.id)}
                        className={styles.removeButton}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Notification"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "list" && (
        <div className={styles.listSection}>
          <div className={styles.notificationsList}>
            {notifications.map((notification) => (
              <div key={notification.id} className={styles.notificationItem}>
                <div className={styles.notificationHeader}>
                  <h3>{notification.title}</h3>
                  <div className={styles.notificationMeta}>
                    <span
                      className={`${styles.category} ${
                        styles[notification.category]
                      }`}
                    >
                      {notification.category}
                    </span>
                    <span className={styles.date}>
                      {formatDate(notification.created_at)}
                    </span>
                    <span
                      className={`${styles.status} ${
                        notification.is_published
                          ? styles.published
                          : styles.draft
                      }`}
                    >
                      {notification.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <p className={styles.notificationContent}>
                  {notification.content}
                </p>

                {notification.documents &&
                  notification.documents.length > 0 && (
                    <DocumentPreview
                      documents={notification.documents}
                      showTitle={true}
                      maxDisplay={3}
                    />
                  )}

                <div className={styles.notificationActions}>
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className={styles.emptyState}>
                No notifications found. Create your first notification!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
