"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DocumentPreview from "./DocumentPreview";
import styles from "@/styles/NoticeList.module.css";

interface DocumentData {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  category: string;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
  category: "general" | "important" | "events";
  is_published: boolean;
  documents?: DocumentData[];
}

export default function NoticeList() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "general" | "important" | "events"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          *,
          notification_documents (
            documents (
              id,
              title,
              file_name,                                                   
              file_path,
              file_type,
              mime_type,
              file_size,
              category
            )
          )
        `
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notices:", error);
      } else {
        // Transform the data to flatten documents array
        const transformedData = (data || []).map((notice) => ({
          ...notice,
          documents:
            notice.notification_documents?.map((nd: any) => nd.documents) || [],
        }));

        // Remove the notification_documents property
        transformedData.forEach((notice) => {
          delete (notice as any).notification_documents;
        });

        setNotices(transformedData);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter(
    (notice) => filter === "all" || notice.category === filter
  );

  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);
  const startIndex = (currentPage - 1) * noticesPerPage;
  const endIndex = startIndex + noticesPerPage;
  const currentNotices = filteredNotices.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className={styles.noticeBoard}>
      <div className={styles.noticeFilters}>
        <button
          className={`${styles.filterBtn} ${
            filter === "all" ? styles.active : ""
          }`}
          onClick={() => {
            setFilter("all");
            setCurrentPage(1);
          }}
        >
          All Notices
        </button>
        <button
          className={`${styles.filterBtn} ${
            filter === "general" ? styles.active : ""
          }`}
          onClick={() => {
            setFilter("general");
            setCurrentPage(1);
          }}
        >
          General
        </button>
        <button
          className={`${styles.filterBtn} ${
            filter === "important" ? styles.active : ""
          }`}
          onClick={() => {
            setFilter("important");
            setCurrentPage(1);
          }}
        >
          Important
        </button>
        <button
          className={`${styles.filterBtn} ${
            filter === "events" ? styles.active : ""
          }`}
          onClick={() => {
            setFilter("events");
            setCurrentPage(1);
          }}
        >
          Events
        </button>
      </div>

      <div className={styles.noticeList}>
        {currentNotices.length === 0 ? (
          <div className={styles.noNotices}>
            <p>No notices found for the selected category.</p>
          </div>
        ) : (
          currentNotices.map((notice) => (
            <div
              key={notice.id}
              className={styles.noticeItem}
              data-category={notice.category}
            >
              <div className={styles.noticeHeader}>
                <h3>{notice.title}</h3>
                <span className={styles.noticeDate}>
                  {formatDate(notice.created_at)}
                </span>
              </div>
              <div className={styles.noticeContent}>
                <p>{notice.content}</p>
              </div>

              {notice.documents && notice.documents.length > 0 && (
                <div className={styles.noticeAttachments}>
                  <DocumentPreview
                    documents={notice.documents}
                    showTitle={true}
                    maxDisplay={3}
                  />
                </div>
              )}

              <div className={styles.noticeFooter}>
                <span className={styles.noticeCategory}>{notice.category}</span>
                {notice.documents && notice.documents.length > 0 && (
                  <span className={styles.attachmentCount}>
                    📎 {notice.documents.length} attachment
                    {notice.documents.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}
