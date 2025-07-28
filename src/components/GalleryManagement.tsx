"use client";

import { useState, useEffect } from "react";
import { GalleryItem } from "@/lib/supabase";
import Image from "next/image";
import ImageUpload from "./ImageUpload";
import styles from "@/styles/GalleryManagement.module.css";

export default function GalleryManagement() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    alt_text: "",
    order_index: 0,
    is_published: true,
  });
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    key: string;
  } | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("/api/gallery", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data);
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      setError("Failed to fetch gallery items");
    }
  };

  const handleImageUpload = (imageData: { url: string; key: string }) => {
    setUploadedImage(imageData);
    setError(""); // Clear any previous errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedImage) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          image_url: uploadedImage.url,
          image_key: uploadedImage.key,
        }),
      });

      if (response.ok) {
        const newItem = await response.json();
        setGalleryItems((prev) => [newItem, ...prev]);

        // Reset form and uploaded image
        setFormData({
          title: "",
          description: "",
          category: "general",
          alt_text: "",
          order_index: 0,
          is_published: true,
        });
        setUploadedImage(null);

        alert("Gallery item created successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create gallery item");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setGalleryItems((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );

        setEditingItem(null);
        setFormData({
          title: "",
          description: "",
          category: "general",
          alt_text: "",
          order_index: 0,
          is_published: true,
        });

        alert("Gallery item updated successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update gallery item");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setGalleryItems((prev) => prev.filter((item) => item.id !== id));
        alert("Gallery item deleted successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete gallery item");
      }
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      setError("Failed to delete gallery item");
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const item = galleryItems.find((item) => item.id === id);
      if (!item) return;

      const response = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          category: item.category,
          alt_text: item.alt_text,
          order_index: item.order_index,
          is_published: !currentStatus, // Toggle the status
        }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setGalleryItems((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );

        const action = !currentStatus ? "published" : "hidden";
        alert(`Gallery item ${action} successfully!`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update gallery item");
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      setError("Failed to update gallery item");
    }
  };

  const startEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      category: item.category,
      alt_text: item.alt_text || "",
      order_index: item.order_index,
      is_published: item.is_published,
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      category: "general",
      alt_text: "",
      order_index: 0,
      is_published: true,
    });
    setUploadedImage(null);
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
    <div className={styles.galleryManagement}>
      <div className={styles.header}>
        <h2>Gallery Management</h2>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.createSection}>
        <h3>{editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}</h3>

        {editingItem && (
          <div className={styles.editNotice}>
            <p>
              Editing: <strong>{editingItem.title}</strong>
            </p>
            <button onClick={cancelEdit} className={styles.cancelEdit}>
              Cancel Edit
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editingItem) {
              handleUpdate(editingItem.id);
            } else {
              handleSubmit(e);
            }
          }}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Enter image title"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter image description"
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="general">General</option>
                <option value="events">Events</option>
                <option value="group">Group Photos</option>
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
                <option value="amenities">Amenities</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="order_index">Order</label>
              <input
                type="number"
                id="order_index"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_index: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="alt_text">Alt Text</label>
            <input
              type="text"
              id="alt_text"
              value={formData.alt_text}
              onChange={(e) =>
                setFormData({ ...formData, alt_text: e.target.value })
              }
              placeholder="Alt text for accessibility"
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) =>
                  setFormData({ ...formData, is_published: e.target.checked })
                }
              />
              Publish immediately
            </label>
          </div>

          {!editingItem && (
            <div className={styles.uploadSection}>
              <label>Upload Image *</label>
              <ImageUpload onImageUploaded={handleImageUpload} maxFiles={1} />

              {uploadedImage && (
                <div className={styles.uploadedPreview}>
                  <div className={styles.previewImage}>
                    <Image
                      src={uploadedImage.url}
                      alt="Uploaded preview"
                      width={200}
                      height={150}
                      className={styles.previewImg}
                    />
                    <div className={styles.previewActions}>
                      <span className={styles.previewLabel}>
                        ✓ Image uploaded
                      </span>
                      <button
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        className={styles.removePreview}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || (!editingItem && !uploadedImage)}
          >
            {loading
              ? editingItem
                ? "Updating..."
                : "Creating..."
              : editingItem
              ? "Update Gallery Item"
              : "Create Gallery Item"}
          </button>
        </form>
      </div>

      <div className={styles.itemsList}>
        <div className={styles.listHeader}>
          <h3>Gallery Items ({galleryItems.length})</h3>
          <div className={styles.statusFilters}>
            <span className={styles.statusLegend}>
              <span className={styles.publishedIndicator}></span> Published
              <span className={styles.draftIndicator}></span> Hidden/Draft
            </span>
          </div>
        </div>
        {galleryItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No gallery items yet. Upload your first image!</p>
          </div>
        ) : (
          <div className={styles.itemsGrid}>
            {galleryItems.map((item) => (
              <div key={item.id} className={styles.galleryCard}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.image_url}
                    alt={item.alt_text || item.title}
                    width={300}
                    height={200}
                    className={styles.image}
                  />
                  <span
                    className={`${styles.statusBadge} ${
                      item.is_published ? styles.published : styles.draft
                    }`}
                  >
                    {item.is_published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className={styles.cardContent}>
                  <h4>{item.title}</h4>
                  {item.description && <p>{item.description}</p>}

                  <div className={styles.meta}>
                    <span>Category: {item.category}</span>
                    <span>Order: {item.order_index}</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>

                  <div className={styles.actions}>
                    <button
                      onClick={() =>
                        handleTogglePublish(item.id, item.is_published)
                      }
                      className={`${styles.toggleBtn} ${
                        item.is_published ? styles.hideBtn : styles.showBtn
                      }`}
                    >
                      {item.is_published ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
