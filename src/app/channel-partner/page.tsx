import styles from "@/styles/ChannelPartner.module.css";
import PartnerForm from "@/components/PartnerForm";

export default function ChannelPartner() {
  return (
    <div className={styles.channelPartnerPage}>
      <section className={`${styles.hero} ${styles.heroWithBg}`}>
        <div className={styles.heroContent}>
          <h1>To Join as a Channel Partner</h1>
          <p>Be Part of Our Growing Success Story</p>
        </div>
      </section>

      <section className={styles.opportunity}>
        <div className={styles.container}>
          <h2>Golden Opportunity to Reach New Heights</h2>
          <div className={styles.opportunityContent}>
            <p>
              Join hands with Deccan Multi State Housing Co-operative Society Ltd
              and be part of our growing success story. As a channel partner,
              you&apos;ll have access to exclusive opportunities and resources
              to grow your business while helping others find their dream homes.
            </p>
            <div className={styles.opportunityHighlights}>
              <div className={styles.highlightCard}>
                <i className="fas fa-chart-line"></i>
                <h3>Growth Potential</h3>
                <p>
                  Unlimited earning potential with our competitive commission
                  structure
                </p>
              </div>
              <div className={styles.highlightCard}>
                <i className="fas fa-handshake"></i>
                <h3>Strong Partnership</h3>
                <p>
                  Work with a trusted name in the housing co-operative sector
                </p>
              </div>
              <div className={styles.highlightCard}>
                <i className="fas fa-users"></i>
                <h3>Network Growth</h3>
                <p>Expand your professional network and client base</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.requirements}>
        <div className={styles.container}>
          <h2>To Join as a Channel Partner</h2>
          <div className={styles.contactDetails}>
            <div className={styles.contactCard}>
              <h3>Contact Details</h3>
              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src="/images/gallery/admin.jpg" alt="Administrator" width={80} height={80} style={{ borderRadius: '50%' }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>J. Paranee Tharan</p>
                  <p style={{ margin: 0 }}>Administrator</p>
                </div>
              </div>
              <div className={styles.contactInfo}>
                <p><i className="fas fa-phone"></i> Phone: +91 9442220276, +91 9940023395</p>
                <p><i className="fas fa-envelope"></i> Email: deccanmultistatehousingsociety@gmail.com</p>
                <p><i className="fas fa-map-marker-alt"></i> Address: 904, Soundarya colony 6th Avenue, Anna nagar west extension, Chennai - 600101<br />
                <i className="fab fa-facebook"></i> Facebook: Deccanmultistatehousingsociety</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2>Benefits of Becoming a Channel Partner</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <i className="fas fa-percentage"></i>
              <h3>Competitive Commission</h3>
              <p>Earn attractive commissions on successful property deals</p>
            </div>
            <div className={styles.benefitCard}>
              <i className="fas fa-graduation-cap"></i>
              <h3>Training Support</h3>
              <p>Access to comprehensive training and development programs</p>
            </div>
            <div className={styles.benefitCard}>
              <i className="fas fa-tools"></i>
              <h3>Marketing Tools</h3>
              <p>Get exclusive marketing materials and sales tools</p>
            </div>
            <div className={styles.benefitCard}>
              <i className="fas fa-shield-alt"></i>
              <h3>Brand Association</h3>
              <p>Partner with a trusted name in the housing sector</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
