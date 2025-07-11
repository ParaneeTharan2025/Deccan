import Link from 'next/link';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.contactInfo}>
          <h3>Contact Us</h3>
          <p><i className="fas fa-phone"></i> Phone: +91 9442220276, +91 9940023395</p>
          <p><i className="fas fa-envelope"></i> Email: deccanmultistatehousingsociety@gmail.com</p>
          <p><i className="fas fa-map-marker-alt"></i> Address: 904, Soundarya colony 6th Avenue, Anna nagar west extension, Chennai - 600101<br />
          <i className="fab fa-facebook"></i> Facebook: Deccanmultistatehousingsociety</p>
        </div>
        <div className={styles.footerLinks}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/channel-partner">Channel Partner</Link></li>
            <li><Link href="/assistance">Assistance</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
} 