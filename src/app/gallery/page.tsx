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

      <GalleryGrid />
    </div>
  );
}
