'use client'
import styles from '../styles/ListCourse.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome } from 'react-icons/fa';

interface Course {
    id: number;
    name: string;
    teacher_name: string;
}
const ListCourse = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchCourses();
    }, []);
    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/courses');
            if (response.ok) {
                const data: Course[] = await response.json();
                setCourses(data);
            } else {
                console.error('Error fetching courses:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleDeleteCourse = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/courses/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setCourses(courses.filter((course) => course.id !== id));
            } else {
                console.error('Error deleting course:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleEditCourse = (id: number) => {
        router.push(`/EditCourse?courseId=${id}`);
    };
    const handleCreateContentOfCourse = (id: number) => {
        router.push(`/CreateContentOfCourse?courseId=${id}`);
    };
    const handleHomeClick = () => {
        router.push('/Home');
    };
    return (
        <div>
            <header className={styles.header}>
                <button onClick={handleHomeClick} className={styles.homeButton}>
                    <FaHome size={20} />
                </button>
                <h1 className={styles.pageTitle}>Danh sách khóa học</h1>
            </header>
            <div className={styles.courseList}>
            <ul>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <li key={course.id}>
                                <div>
                                    <h3>{course.name}</h3>
                                    <button onClick={() => handleEditCourse(course.id)} className={styles.editButton}>Sửa</button>
                                    <button onClick={() => handleDeleteCourse(course.id)} className={styles.deleteButton}>Xóa</button>
                                    <button onClick={() => handleCreateContentOfCourse(course.id)} className={styles.createContentButton}>Tạo nội dung</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No quizzes available.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}
export default ListCourse;
