import styles from "@/styles/Assistance.module.css";
import dynamic from "next/dynamic";

// Dynamically import the map component with no SSR
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Assistance() {
  return (
    <div className={styles.assistancePage}>
      <section className={`${styles.hero} ${styles.heroWithBg}`}>
        <div className={styles.heroContent}>
          <h1>Assistance</h1>
          <p>We&apos;re Here to Help You</p>
        </div>
      </section>

      <section className={styles.assistanceInfo}>
        <div className={styles.container}>
          <h2>How Can We Help You?</h2>
          <div className={styles.assistanceGrid}>
            <div className={styles.assistanceCard}>
              <i className="fas fa-home"></i>
              <h3>Housing Queries</h3>
              <p>
                Get assistance with property selection, documentation, and
                registration process.
              </p>
            </div>
            <div className={styles.assistanceCard}>
              <i className="fas fa-file-contract"></i>
              <h3>Documentation</h3>
              <p>
                Support with legal documentation and paperwork requirements.
              </p>
            </div>
            <div className={styles.assistanceCard}>
              <i className="fas fa-money-bill-wave"></i>
              <h3>Financial Guidance</h3>
              <p>
                Information about payment plans, loans, and financial
                procedures.
              </p>
            </div>
            <div className={styles.assistanceCard}>
              <i className="fas fa-headset"></i>
              <h3>Technical Support</h3>
              <p>Technical assistance and property-related queries.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactDetails}>
            <h2>Contact Information</h2>
            <div className={styles.contactInfo}>
              <div className={styles.infoItem}>
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Address</h3>
                  <p>904, Soundarya colony 6th Avenue, Anna nagar west extension, Chennai - 600101</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <i className="fas fa-phone"></i>
                <div>
                  <h3>Phone</h3>
                  <p>+91 9442220276, +91 9940023395</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>deccanmultistatehousingsociety@gmail.com</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <i className="fas fa-clock"></i>
                <div>
                  <h3>Working Hours</h3>
                  <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mapSection}>
        <div className={styles.container}>
          <h2>Our Location</h2>
          <div className={styles.locationMap}>
            <img 
              src="/images/assistance/location-map.png" 
              alt="Our Location Map"
              className={styles.mapImage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
