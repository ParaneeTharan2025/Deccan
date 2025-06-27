'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/Gallery.module.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

type GalleryItem = {
  src: string;
  category: string;
  title: string;
  alt: string;
};

const galleryItems: GalleryItem[] = [
  {
    src: '/images/gallery/residential-1.jpeg',
    category: 'residential',
    title: 'Residential Property 1',
    alt: 'Residential Property 1'
  },
  {
    src: '/images/gallery/residential-2.jpeg',
    category: 'residential',
    title: 'Residential Property 2',
    alt: 'Residential Property 2'
  },
  {
    src: '/images/gallery/commercial-1.jpeg',
    category: 'commercial',
    title: 'Commercial Property 1',
    alt: 'Commercial Property 1'
  },
  {
    src: '/images/gallery/commercial-2.jpeg',
    category: 'commercial',
    title: 'Commercial Property 2',
    alt: 'Commercial Property 2'
  },
  {
    src: '/images/gallery/amenity-1.jpeg',
    category: 'amenities',
    title: 'Amenity 1',
    alt: 'Amenity 1'
  },
  {
    src: '/images/gallery/amenity-2.jpeg',
    category: 'amenities',
    title: 'Amenity 2',
    alt: 'Amenity 2'
  },
  {
    src: '/images/gallery/event-1.jpeg',
    category: 'events',
    title: 'Event 1',
    alt: 'Event 1'
  },
  {
    src: '/images/gallery/event-2.jpeg',
    category: 'events',
    title: 'Event 2',
    alt: 'Event 2'
  }
];

export default function GalleryGrid() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className={styles.galleryFilters}>
        <div className={styles.container}>
          <div className={styles.filterButtons}>
            <button 
              className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.active : ''}`}
              onClick={() => handleFilterClick('all')}
            >
              All
            </button>
            <button 
              className={`${styles.filterBtn} ${activeFilter === 'residential' ? styles.active : ''}`}
              onClick={() => handleFilterClick('residential')}
            >
              Residential
            </button>
            <button 
              className={`${styles.filterBtn} ${activeFilter === 'commercial' ? styles.active : ''}`}
              onClick={() => handleFilterClick('commercial')}
            >
              Commercial
            </button>
            <button 
              className={`${styles.filterBtn} ${activeFilter === 'amenities' ? styles.active : ''}`}
              onClick={() => handleFilterClick('amenities')}
            >
              Amenities
            </button>
            <button 
              className={`${styles.filterBtn} ${activeFilter === 'events' ? styles.active : ''}`}
              onClick={() => handleFilterClick('events')}
            >
              Events
            </button>
          </div>
        </div>
      </section>

      <section className={styles.galleryGrid}>
        <div className={styles.container}>
          <div className={styles.imageGrid}>
            {filteredItems.map((item, index) => (
              <div 
                key={item.src}
                className={`${styles.galleryItem} ${styles[item.category]}`}
                onClick={() => openLightbox(index)}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.src}
                    alt={item.alt}
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
        </div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryItems.map(item => ({ src: item.src }))}
      />
    </>
  );
} 