'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/images/home/logo.jpeg"
              alt="Deccan Multi State Housing Cooperative Society Ltd. Logo"
              width={100}
              height={60}
              priority
            />
          </Link>
          <h1>Deccan Multi State Housing Cooperative Society Ltd</h1>
        </div>
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <li><Link href="/" className={styles.active}>Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/channel-partner">Channel Partner</Link></li>
          <li><Link href="/assistance">Assistance</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/notification">Notification</Link></li>
        </ul>
        <div 
          className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </header>
  );
} 