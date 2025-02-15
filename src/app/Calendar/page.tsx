"use client";
import { useSearchParams } from 'next/navigation'; 
import { useState, useEffect } from 'react';
import { Calendar as AntCalendar, Badge, Spin, Alert } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';  
import styles from '../styles/Calendar.module.css';  
import { FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

dayjs.extend(isBetween);

interface Schedule {
  course_name: string;
  schedule: {
    type: string;
    start_time: string;
    end_time: string;
    schedule_data: string[];
    start_date: string;
    end_date: string;
  };
}

const Calendar = () => {
  const searchParams = useSearchParams();
  const userId = searchParams?.get('teacher_id') || '';
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSchedules();
  }, [userId]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teachers/${userId}/schedule`);
      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }
      const result = await response.json();
      if (result.success) {
        setSchedules(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải lịch dạy');
    } finally {
      setLoading(false);
    }
  };

  const getListData = (value: Dayjs) => {
    const listData: { type: 'success' | 'default' | 'error' | 'warning' | 'processing'; content: string; time: string }[] = [];
    
    schedules.forEach(schedule => {
      const { start_date, end_date, schedule_data, start_time, end_time } = schedule.schedule;
      const course_name = schedule.course_name;  
      const start = dayjs(start_date);
      const end = dayjs(end_date);
      if (value.isBetween(start, end, null, '[]')) {
        const dayOfWeek = value.format('dddd').toLowerCase(); 
        if (schedule_data.includes(dayOfWeek)) {
      listData.push({
        type: 'success',  
        content: course_name,
        time: `${dayjs(start_time).format('HH:mm')} - ${dayjs(end_time).format('HH:mm')}`,  
          });
        }
      }
    });
    return listData;
  };
  
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className={styles.events}>
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
            <div>{item.time}</div>  
          </li>
        ))}
      </ul>
    );
  };

  const handleHomeClick = () => {
    router.push('/Home');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" tip="Đang tải lịch dạy..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.alert}>
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={handleHomeClick} className={styles.homeButton}>
          <FaHome size={20} />
        </button>
        <h1 className={styles.pageTitle}>Thời khóa biểu</h1>
      </header>
      <AntCalendar dateCellRender={dateCellRender} />
    </div>
  );
};

export default Calendar;