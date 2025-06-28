import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <section className={`${styles.hero} ${styles.heroWithBg}`}>
        <div className={styles.heroContent}>
          <h1>Welcome to Deccan Multi State Housing Cooperative Society Ltd</h1>
          <p>Building Communities, Creating Homes, Sale of plots</p>
        </div>
      </section>

      <section className={styles.introduction}>
        <div className={styles.container}>
          <h2>Introduction</h2>
          <p>
            Deccan Multi State Housing Cooperative Society Ltd is a Multi State
            Housing Cooperative Society dedicated to providing quality housing
            solutions to our members. We believe in creating sustainable
            communities that enhance the quality of life for all residents.
          </p>
          <p>
            We have established
            ourselves as a trusted name in community development and cooperative
            housing. Our Society ambition is giving house to all. To promote 
            residential zones in the form of plots with proper approval from the authorities.
            
          </p>
        </div>
      </section>

      <section className={styles.history}>
        <div className={styles.container}>
          <h2>History of the Society</h2>
          <div className={styles.historyContent}>
            <p>
              Founded with a vision to revolutionize cooperative housing, Deccan
              Multi State Housing Cooperative Society Ltd has grown from humble
              beginnings to become a trusted name in community development. Our
              journey is marked by:
            </p>
            <ul>
              <li>Dedicated service in the housing sector</li>
              <li>Growing community of satisfied members</li>
              <li>Strong partnerships with industry stakeholders</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.objectives}>
        <div className={styles.container}>
          <h2>Main Objectives of the Society</h2>
          <div className={styles.objectivesGrid}>
            <div className={styles.objectiveCard}>
              <i className="fas fa-home"></i>
              <h3>Affordable Housing</h3>
              <p>Provide cost-effective housing solutions to our members</p>
            </div>
            <div className={styles.objectiveCard}>
              <i className="fas fa-users"></i>
              <h3>Community Building</h3>
              <p>Create vibrant, sustainable communities</p>
            </div>
            <div className={styles.objectiveCard}>
              <i className="fas fa-shield-alt"></i>
              <h3>Member Protection</h3>
              <p>Ensure member interests are protected</p>
            </div>
            <div className={styles.objectiveCard}>
              <i className="fas fa-handshake"></i>
              <h3>Sale of plots</h3>
              <p>Foster mutual growth and development</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.administration}>
        <div className={styles.container}>
          <h2>Proposed Administration</h2>
          <div className={styles.adminStructure}>
            <div className={styles.adminContent}>
              <p>
                Our administrative structure is designed to ensure efficient
                management and transparent operations. The society is managed
                by:
              </p>
              <ul>
                <li>Board of Directors</li>
                <li>Executive Committee</li>
                <li>Professional Management Team</li>
                <li>Advisory Panel</li>
              </ul>
            </div>
            <div className={styles.adminHighlights}>
              <div className={styles.highlightBox}>
                <i className="fas fa-chart-line"></i>
                <h3>Transparent Operations</h3>
                <p>Clear and open management practices</p>
              </div>
              <div className={styles.highlightBox}>
                <i className="fas fa-tasks"></i>
                <h3>Efficient Management</h3>
                <p>Professional approach to administration</p>
              </div>
            </div>
          </div>
          
          <div className={styles.branchLocations}>
            <h3>Branch Locations</h3>
            <p>Our society operates branches across two states to serve our members effectively:</p>
            
            <div className={styles.statesGrid}>
              <div className={styles.stateCard}>
                <h4>Andhra Pradesh</h4>
                <ul>
                  <li>Gudiwada</li>
                  <li>Vijayawada</li>
                  <li>Gudur</li>
                </ul>
              </div>
              
              <div className={styles.stateCard}>
                <h4>Tamil Nadu</h4>
                <ul>
                  <li>Chennai</li>
                  <li>Thiruvallur</li>
                  <li>Thanjavur</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
