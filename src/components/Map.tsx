'use client';

import Image from 'next/image';
import styles from '@/styles/Map.module.css';

export default function Map() {
  return (
    <div className={styles.map}>
      <Image
        src="/images/location-map.png"
        alt="Deccan Multi State Housing Cooperative Society Location"
        width={800}
        height={400}
        layout="responsive"
        priority
      />
    </div>
  );
} 