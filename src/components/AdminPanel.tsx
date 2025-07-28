"use client";

import { FormEvent, useState, useEffect } from "react";
import DocumentUpload from "./DocumentUpload";
import DocumentPreview from "./DocumentPreview";
import GalleryManagement from "./GalleryManagement";
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
  const [activeTab, setActiveTab] = useState<"create" | "list" | "gallery">(
    "create"
  );
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    category: "general",
    is_published: true,
  });

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
        setEditingNotification(null); // Clear any edit state

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

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setEditData({
      title: notification.title,
      content: notification.content,
      category: notification.category,
      is_published: notification.is_published,
    });
    setActiveTab("create"); // Switch to form tab
  };

  const handlePublishNotification = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const notification = notifications.find((n) => n.id === notificationId);
      if (!notification) return;

      const response = await fetch(
        `/api/admin/notifications/${notificationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: notification.title,
            content: notification.content,
            category: notification.category,
            is_published: true,
          }),
        }
      );

      if (response.ok) {
        const updatedNotification = await response.json();
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, ...updatedNotification } : n
          )
        );
      }
    } catch (error) {
      console.error("Error publishing notification:", error);
    }
  };

  const handleUpdateNotification = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingNotification) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(
        `/api/admin/notifications/${editingNotification.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      if (response.ok) {
        const updatedNotification = await response.json();
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === editingNotification.id
              ? { ...n, ...updatedNotification }
              : n
          )
        );

        // Reset edit state
        setEditingNotification(null);
        setEditData({
          title: "",
          content: "",
          category: "general",
          is_published: true,
        });

        alert("Notification updated successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update notification");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingNotification(null);
    setEditData({
      title: "",
      content: "",
      category: "general",
      is_published: true,
    });
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
        <h1>Admin Panel</h1>
      </div>

      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("create")}
          className={`${styles.tab} ${
            activeTab === "create" ? styles.active : ""
          }`}
        >
          Create Notification
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`${styles.tab} ${
            activeTab === "list" ? styles.active : ""
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`${styles.tab} ${
            activeTab === "gallery" ? styles.active : ""
          }`}
        >
          Gallery Management
        </button>
      </div>

      {activeTab === "create" && (
        <div className={styles.createSection}>
          <h3>
            {editingNotification
              ? "Edit Notification"
              : "Create New Notification"}
          </h3>

          {editingNotification && (
            <div className={styles.editNotice}>
              <p>
                Editing: <strong>{editingNotification.title}</strong>
              </p>
              <button onClick={cancelEdit} className={styles.cancelEdit}>
                Cancel Edit
              </button>
            </div>
          )}

          <form
            onSubmit={
              editingNotification ? handleUpdateNotification : handleSubmit
            }
            className={styles.notificationForm}
          >
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={
                  editingNotification ? editData.title : notificationData.title
                }
                onChange={(e) => {
                  if (editingNotification) {
                    setEditData({
                      ...editData,
                      title: e.target.value,
                    });
                  } else {
                    setNotificationData({
                      ...notificationData,
                      title: e.target.value,
                    });
                  }
                }}
                placeholder="Enter notification title..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                rows={4}
                value={
                  editingNotification
                    ? editData.content
                    : notificationData.content
                }
                onChange={(e) => {
                  if (editingNotification) {
                    setEditData({
                      ...editData,
                      content: e.target.value,
                    });
                  } else {
                    setNotificationData({
                      ...notificationData,
                      content: e.target.value,
                    });
                  }
                }}
                placeholder="Enter notification content..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={
                    editingNotification
                      ? editData.is_published
                      : notificationData.is_published
                  }
                  onChange={(e) => {
                    if (editingNotification) {
                      setEditData({
                        ...editData,
                        is_published: e.target.checked,
                      });
                    } else {
                      setNotificationData({
                        ...notificationData,
                        is_published: e.target.checked,
                      });
                    }
                  }}
                />
                Publish immediately
              </label>
            </div>

            {!editingNotification && (
              <div className={styles.formGroup}>
                <label>Documents</label>
                <DocumentUpload
                  onDocumentUploaded={handleDocumentUploaded}
                  category="notices"
                  maxFiles={3}
                />

                {attachedDocuments.length > 0 && (
                  <div className={styles.attachedDocuments}>
                    <h4>Attached Documents</h4>
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
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading
                ? editingNotification
                  ? "Updating..."
                  : "Creating..."
                : editingNotification
                ? "Update Notification"
                : "Create Notification"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "list" && (
        <div className={styles.listSection}>
          <h3>All Notifications</h3>
          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No notifications yet</h3>
              <p>Create your first notification to get started!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className={styles.notificationCard}>
                <div className={styles.notificationHeader}>
                  <h3 className={styles.notificationTitle}>
                    {notification.title}
                  </h3>
                  <span
                    className={`${styles.statusBadge} ${
                      notification.is_published
                        ? styles.published
                        : styles.draft
                    }`}
                  >
                    {notification.is_published ? "Published" : "Draft"}
                  </span>
                </div>

                <p className={styles.notificationContent}>
                  {notification.content}
                </p>

                <div className={styles.notificationMeta}>
                  <span>{formatDate(notification.created_at)}</span>
                  <span>{notification.category}</span>
                </div>

                {notification.documents &&
                  notification.documents.length > 0 && (
                    <div className={styles.documentsList}>
                      <h4>Attached Documents</h4>
                      <DocumentPreview
                        documents={notification.documents}
                        showTitle={true}
                        maxDisplay={3}
                      />
                    </div>
                  )}

                <div className={styles.notificationActions}>
                  <button
                    onClick={() => handleEditNotification(notification)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  {!notification.is_published && (
                    <button
                      onClick={() => handlePublishNotification(notification.id)}
                      className={styles.publishButton}
                    >
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "gallery" && (
        <div className={styles.gallerySection}>
          <GalleryManagement />
        </div>
      )}
    </div>
  );
}
