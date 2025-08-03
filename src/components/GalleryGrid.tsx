"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/Gallery.module.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { GalleryItem } from "@/lib/supabase";

export default function GalleryGrid() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/gallery?published=true");

      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data);
      } else {
        throw new Error("Failed to fetch gallery items");
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      setError("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <section className={styles.galleryGrid}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <p>Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.galleryGrid}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={fetchGalleryItems} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className={styles.galleryGrid}>
        <div className={styles.container}>
          {galleryItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No gallery images available yet.</p>
            </div>
          ) : (
            <div className={styles.imageGrid}>
              {galleryItems.map((item, index) => (
                <div
                  key={item.id}
                  className={styles.galleryItem}
                  onClick={() => openLightbox(index)}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      width={400}
                      height={300}
                      className={styles.image}
                    />
                    <div className={styles.overlay}>
                      <span>{item.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryItems.map((item) => ({
          src: item.image_url,
          alt: item.title,
          title: item.title,
        }))}
      />
    </>
  );
}
