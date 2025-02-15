'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Dashboard.module.css';
import { FaGraduationCap, FaBook, FaClipboardList, FaChartBar, FaCog, FaSignOutAlt, FaBell } from 'react-icons/fa';

const DashBoard = () => {
  const [username, setUsername] = useState('Username');
  const [stats, setStats] = useState({
    completedTests: 8,
    totalQuestions: 432,
    completedQuestions: 216,
    percentage: 50
  });

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>logo</h2>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/dashboard" className={`${styles.navItem} ${styles.active}`}>
            <FaChartBar /> Dashboard
          </Link>
          <Link href="/syllabus" className={styles.navItem}>
            <FaBook /> Syllabus
          </Link>
          <Link href="/courses" className={styles.navItem}>
            <FaGraduationCap /> Các Khóa Học
          </Link>
          <Link href="/online-class" className={styles.navItem}>
            <FaClipboardList /> Lớp Ôn Đề
          </Link>
          <Link href="/reports" className={styles.navItem}>
            <FaChartBar /> Reports
          </Link>
        </nav>

        <div className={styles.bottomNav}>
          <Link href="/settings" className={styles.navItem}>
            <FaCog /> Settings
          </Link>
          <Link href="/logout" className={styles.navItem}>
            <FaSignOutAlt /> Sign out
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Welcome back, {username}</h1>
          <div className={styles.headerRight}>
            <select className={styles.sort}>
              <option>Last Week</option>
              {/* Add other options */}
            </select>
            <div className={styles.notification}>
              <FaBell />
              <span className={styles.badge}>1</span>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className={styles.coursesSection}>
          <h2>
            <FaGraduationCap /> Khóa học của bạn
          </h2>
          <div className={styles.emptyState}>
            <img src="/time-to-study.png" alt="No courses" />
            <p>Bạn đang không theo học khóa học nào.</p>
            <button className={styles.searchButton}>
              Tìm kiếm khóa học <span>�</span>
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className={styles.statsCard}>
          <div className={styles.statItem}>
            <label>Số bài test đã làm</label>
            <span>{stats.completedTests}</span>
          </div>
          <div className={styles.statItem}>
            <label>Số câu sai / Tổng bài thi</label>
            <span>{stats.completedQuestions} / {stats.totalQuestions}</span>
          </div>
          <div className={styles.statItem}>
            <label>Tỉ lệ</label>
            <span>{stats.percentage}%</span>
          </div>
          <div className={styles.pieChart}>
            {/* Add pie chart visualization here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;