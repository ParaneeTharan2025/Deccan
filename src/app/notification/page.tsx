import styles from "@/styles/Notification.module.css";
import NoticeList from "@/components/NoticeList";

export default function Notification() {
  return (
    <div className={styles.notificationPage}>
      <section className={`${styles.hero} ${styles.heroWithBg}`}>
        <div className={styles.heroContent}>
          <h1>Notifications</h1>
          <p>Stay Updated with Latest Announcements</p>
        </div>
      </section>

      <section className={styles.noticeBoard}>
        <div className={styles.container}>
          <NoticeList />
        </div>
      </section>
    </div>
  );
}
