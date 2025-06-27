"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminPanel from "@/components/AdminPanel";
import styles from "@/styles/AdminDashboard.module.css";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin");
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div className={styles.headerActions}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <AdminPanel />
      </div>
    </div>
  );
}
