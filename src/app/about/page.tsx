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
          
          <div className={styles.boardStructure}>
            {/* Chairman Section */}
            <div className={styles.chairmanSection}>
              <div className={styles.chairmanCard}>
                <div className={styles.chairmanImage}>
                  <Image
                    src="/images/gallery/chariman.jpg"
                    alt="Chairman"
                    width={200}
                    height={200}
                  />
                </div>
                <h4>Dr. K. Indira</h4>
                <p>Chairman</p>
              </div>
            </div>

            {/* Connecting Line */}
            <div className={styles.connectingLine}>
              <div className={styles.verticalLine}></div>
              <div className={styles.horizontalLine}></div>
            </div>

            {/* Directors Section - Single Line */}
            <div className={styles.directorsSection}>
              <div className={styles.directorsRow}>
                <div className={styles.directorCard}>
                  <div className={styles.directorImage}>
                    <Image
                      src="/images/gallery/director1.jpg"
                      alt="M.D Nandakumar"
                      width={120}
                      height={120}
                    />
                  </div>
                  <h4>M.D Nandakumar</h4>
                  <p>Director</p>
                </div>
                
                <div className={styles.directorCard}>
                  <div className={styles.directorImage}>
                    <Image
                      src="/images/gallery/director6.jpg"
                      alt="T. Rajapandiyan"
                      width={120}
                      height={120}
                    />
                  </div>
                  <h4>T. Rajapandiyan</h4>
                  <p>Director</p>
                </div>
                
                <div className={styles.directorCard}>
                  <div className={styles.directorImage}>
                    <Image
                      src="/images/gallery/director2.jpg"
                      alt="Dr. K. Vijaya Bhaskar Raju"
                      width={120}
                      height={120}
                    />
                  </div>
                  <h4>Dr. K. Vijaya Bhaskar Raju</h4>
                  <p>Director</p>
                </div>
                
                <div className={styles.directorCard}>
                  <div className={styles.directorImage}>
                    <Image
                      src="/images/gallery/director4.jpg"
                      alt="S. Jayarani Yuvaraj"
                      width={120}
                      height={120}
                    />
                  </div>
                  <h4>S. Jayarani Yuvaraj</h4>
                  <p>Director</p>
                </div>
                
                <div className={styles.directorCard}>
                  <div className={styles.directorImage}>
                    <Image
                      src="/images/gallery/director3.jpg"
                      alt="P. Murugan"
                      width={120}
                      height={120}
                    />
                  </div>
                  <h4>P. Murugan</h4>
                  <p>Director</p>
                </div>
                
                <div className={styles.directorCard}>
                  <div className={styles.directorImage}>
                    <Image
                      src="/images/gallery/director5.jpg"
                      alt="G. DIWAKAR"
                      width={120}
                      height={120}
                    />
                  </div>
                  <h4>G. DIWAKAR</h4>
                  <p>Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Administrator Section */}
      <section className={styles.administratorSection}>
        <div className={styles.container}>
          <h2>Administrator</h2>
          <div className={styles.administratorCard}>
            <div className={styles.administratorImage}>
              <Image
                src="/images/gallery/admin.jpg"
                alt="Administrator"
                width={180}
                height={180}
              />
            </div>
            <h3>J. Paranee Tharan</h3>
            <p>Administrator</p>
          </div>
        </div>
      </section>

      <section className={styles.societyFunctions}>
        <div className={styles.container}>
          <h2>Functions of the Society</h2>
          <div className={styles.functionsList}>
            <ul>
              <li>Provide affordable housing solutions to members</li>
              <li>Sale of Plots</li>
              <li>Facilitate community development</li>
              <li>Ensure compliance with co-operative society regulations</li>
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
            </div>
            <div className={styles.landCard}>
              <h3>Commercial Plots</h3>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.housingSchemes}>
        <div className={styles.container}>
          <h2>Proposed Housing Schemes</h2>
          <div className={styles.schemesGrid}>
            <div className={styles.schemeCard}>
              <h3>MANJAMBAKKAM</h3>
              <p className={styles.address}>
                Near Madhavaram
              </p>
            </div>
            
            <div className={styles.schemeCard}>
              <h3>THEEYAMBAKKAM</h3>
              <p className={styles.address}>
                Near Madhavaram
              </p>
            </div>
            
            <div className={styles.schemeCard}>
              <h3>SEWAPET</h3>
              <p className={styles.address}>
                Near Kalyana Kuppam, Thiruvallur District
              </p>
            </div>
            
            <div className={styles.schemeCard}>
              <h3>KILANUR</h3>
              <p className={styles.address}>
                Near Veera Raghava Puram, Thiruvallur District
              </p>
            </div>
            
            <div className={styles.schemeCard}>
              <h3>KOLATHUR</h3>
              <p className={styles.address}>
                Near Thoothukudi
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.conclusion}>
        <div className={styles.container}>
          <h2>Conclusion</h2>
          <p>
            Deccan Multi State Housing Co-operative Society Ltd continues to
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
