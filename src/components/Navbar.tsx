'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/images/home/logo.jpeg"
              alt="Deccan Multi State Housing Co-operative Society Ltd. Logo"
              width={100}
              height={60}
              priority
            />
          </Link>
          <div className={styles.logoText}>
            <h1>Deccan Multi State Housing Co-operative Society Ltd</h1>
            <div className={styles.regdNumber}>
              Regd # MSCS/CR/1601/2025
            </div>
          </div>
        </div>
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <li><Link href="/" className={isActive('/') ? styles.active : ''}>Home</Link></li>
          <li><Link href="/about" className={isActive('/about') ? styles.active : ''}>About</Link></li>
          <li><Link href="/channel-partner" className={isActive('/channel-partner') ? styles.active : ''}>Channel Partner</Link></li>
          <li><Link href="/assistance" className={isActive('/assistance') ? styles.active : ''}>Assistance</Link></li>
          <li><Link href="/gallery" className={isActive('/gallery') ? styles.active : ''}>Gallery</Link></li>
          <li><Link href="/notification" className={isActive('/notification') ? styles.active : ''}>Notification</Link></li>
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