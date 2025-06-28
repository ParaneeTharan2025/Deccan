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
    src: '/images/gallery/grp1.jpg',
    category: 'group',
    title: 'Group Photo 1',
    alt: 'Group Photo 1'
  },
  {
    src: '/images/gallery/grp2.jpg',
    category: 'group',
    title: 'Group Photo 2',
    alt: 'Group Photo 2'
  },
  {
    src: '/images/gallery/grp3.jpg',
    category: 'group',
    title: 'Group Photo 3',
    alt: 'Group Photo 3'
  },
  {
    src: '/images/gallery/grp4.jpg',
    category: 'group',
    title: 'Group Photo 4',
    alt: 'Group Photo 4'
  },
  {
    src: '/images/gallery/grp5.jpg',
    category: 'group',
    title: 'Group Photo 5',
    alt: 'Group Photo 5'
  },
  {
    src: '/images/gallery/grp6.jpg',
    category: 'group',
    title: 'Group Photo 6',
    alt: 'Group Photo 6'
  },
  {
    src: '/images/gallery/grp7.jpg',
    category: 'group',
    title: 'Group Photo 7',
    alt: 'Group Photo 7'
  },
  {
    src: '/images/gallery/grp8.jpg',
    category: 'group',
    title: 'Group Photo 8',
    alt: 'Group Photo 8'
  },
  {
    src: '/images/gallery/grp9.jpg',
    category: 'group',
    title: 'Group Photo 9',
    alt: 'Group Photo 9'
  },
  {
    src: '/images/gallery/grp10.jpg',
    category: 'group',
    title: 'Group Photo 10',
    alt: 'Group Photo 10'
  },
  {
    src: '/images/gallery/grp11.jpg',
    category: 'group',
    title: 'Group Photo 11',
    alt: 'Group Photo 11'
  },
  {
    src: '/images/gallery/grp12.jpg',
    category: 'group',
    title: 'Group Photo 12',
    alt: 'Group Photo 12'
  },
  {
    src: '/images/gallery/grp13.jpg',
    category: 'group',
    title: 'Group Photo 13',
    alt: 'Group Photo 13'
  },
  {
    src: '/images/gallery/grp14.jpg',
    category: 'group',
    title: 'Group Photo 14',
    alt: 'Group Photo 14'
  },
  {
    src: '/images/gallery/grp15.jpg',
    category: 'group',
    title: 'Group Photo 15',
    alt: 'Group Photo 15'
  },
  {
    src: '/images/gallery/grp16.jpg',
    category: 'group',
    title: 'Group Photo 16',
    alt: 'Group Photo 16'
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className={styles.galleryGrid}>
        <div className={styles.container}>
          <div className={styles.imageGrid}>
            {galleryItems.map((item, index) => (
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