import styles from "@/styles/About.module.css";
import Image from "next/image";

export default function About() {
  return (
    <div className={styles.aboutPage}>
      <section className={`${styles.hero} ${styles.heroWithBg}`}>
        <div className={styles.heroContent}>
          <h1>About Us</h1>
          <p>Building Trust Through Transparency</p>
        </div>
      </section>

      <section className={styles.boardDirectors}>
        <div className={styles.container}>
          <h2>Board of Directors</h2>
          <div className={styles.directorsGrid}>
            <div className={styles.directorCard}>
              <div className={styles.directorImage}>
                <Image
                  src="/images/placeholder.jpg"
                  alt="Director Name"
                  width={200}
                  height={200}
                />
              </div>
              <h3>Director Name</h3>
              <p>Position</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.societyFunctions}>
        <div className={styles.container}>
          <h2>Functions of the Society</h2>
          <div className={styles.functionsList}>
            <ul>
              <li>Provide affordable housing solutions to members</li>
              <li>Maintain and manage society properties</li>
              <li>Facilitate community development</li>
              <li>Ensure compliance with cooperative society regulations</li>
              <li>Manage member relations and grievances</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.ledgersBooks}>
        <div className={styles.container}>
          <h2>Ledgers and Books Maintained</h2>
          <div className={styles.ledgersGrid}>
            <div className={styles.ledgerItem}>
              <h3>Financial Records</h3>
              <ul>
                <li>Cash Book</li>
                <li>General Ledger</li>
                <li>Members&apos; Ledger</li>
                <li>Investment Register</li>
              </ul>
            </div>
            <div className={styles.ledgerItem}>
              <h3>Administrative Records</h3>
              <ul>
                <li>Minutes Book</li>
                <li>Share Register</li>
                <li>Member Register</li>
                <li>Property Register</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.landProvisions}>
        <div className={styles.container}>
          <h2>Various Lands Provided by the Society</h2>
          <div className={styles.landsGrid}>
            <div className={styles.landCard}>
              <h3>Residential Plots</h3>
              <p>Details about residential plot schemes and locations</p>
            </div>
            <div className={styles.landCard}>
              <h3>Commercial Plots</h3>
              <p>Information about commercial land development</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.housingSchemes}>
        <div className={styles.container}>
          <h2>Proposed Housing Schemes</h2>
          <div className={styles.schemesGrid}>
            <div className={styles.schemeCard}>
              <h3>Scheme Name</h3>
              <p>Description of the housing scheme</p>
              <ul>
                <li>Location details</li>
                <li>Plot sizes available</li>
                <li>Amenities provided</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.conclusion}>
        <div className={styles.container}>
          <h2>Conclusion</h2>
          <p>
            Deccan Multi State Housing Cooperative Society Ltd continues to
            strive for excellence in providing quality housing solutions while
            maintaining the highest standards of transparency and member
            satisfaction. Our commitment to community development and
            sustainable growth remains unwavering.
          </p>
        </div>
      </section>
    </div>
  );
}
