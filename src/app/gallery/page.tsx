import styles from "@/styles/Gallery.module.css";
import GalleryGrid from "@/components/GalleryGrid";

export default function Gallery() {
  return (
    <div className={styles.galleryPage}>
      <section className={`${styles.hero} ${styles.heroWithBg}`}>
        <div className={styles.heroContent}>
          <h1>Gallery</h1>
          <p>Showcasing Our Projects and Events</p>
        </div>
      </section>

      <section className={styles.galleryFilters}>
        <div className={styles.container}>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${styles.active}`}
              data-filter="all"
            >
              All
            </button>
            <button className={styles.filterBtn} data-filter="residential">
              Residential
            </button>
            <button className={styles.filterBtn} data-filter="commercial">
              Commercial
            </button>
            <button className={styles.filterBtn} data-filter="amenities">
              Amenities
            </button>
            <button className={styles.filterBtn} data-filter="events">
              Events
            </button>
          </div>
        </div>
      </section>

      <GalleryGrid />
    </div>
  );
}
