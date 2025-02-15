"use client";
import Link from "next/link";
import styles from "../styles/DetailCourse.module.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from "next-auth/react";
import Cookies from 'js-cookie';

interface User {
  name: string;
  email: string;
  id: string;
  roles: string[];
}

interface Schedule {
  id: number;
  course_id: number;
  type: string;
  start_time: string;
  end_time: string;
  schedule_data: string[];
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  provider: string;
  provider_id: string;
}

interface Course {
  id: number;
  name: string;
  price: string;
  start_date: string;
  end_date: string;
  teacher_id: number;
  detail: string;
  status: string;
  max_students: number;
  schedule: Schedule;
  teacher?: Teacher;
  image: string;
  video_url:string;
}
interface tableOfContents{
  id: number;
  title: string;
  description: string;
  image: string;
}
interface CourseResponse {
  course: Course;
  teacher: Teacher[];
  tableOfContents: tableOfContents[];
}

const DetailCourse = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams?.get('courseId');
    const [course, setCourse] = useState<Course | null>(null);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [tableOfContents, setTableOfContents] = useState<tableOfContents[]>([]);

    useEffect(() => {
        const loadUserData = () => {
            const userData = Cookies.get("user");
            if (userData) {
                try {
                    const userFromCookie = JSON.parse(userData) as User;
                    setUser(userFromCookie);
                    if (userFromCookie.id) {
                        fetchUserInfo(userFromCookie.id);
                    }
                } catch (error) {
                    console.error("Error parsing user data:", error);
                }
            }
        };

        loadUserData();
        if (courseId) {
            fetchCourseInfo();
        }
    }, [courseId]);
    const Home=()=>{
        router.push("/Home");
      }
    const fetchCourseInfo = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch course info');
            }
            const data: CourseResponse = await response.json();
            console.log('Raw Data:', data);
            setCourse(data.course);
            setTableOfContents(data.tableOfContents || []);  
            if (data.teacher && data.teacher.length > 0) {
                setTeacher(data.teacher[0]);
              }
        } catch (error) {
            console.error('Error fetching course info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserInfo = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/info?provider_id=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            const data = await response.json();
            setUserRole(data.roles || []);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };
    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
      };
    const handleLogout = async () => {
        Cookies.remove("user");
        Cookies.remove("role");
        setUser(null);
        setUserRole([]);
        await signOut();
        router.push("/Login");
    };
    const getVideo= (url: string) => {
      console.log(url);
        const videoId = url.split('v=')[1]?.split('\r\n')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    return (
        <div className={styles.pageWrapper}>
           <header className={styles.header}>
        <h1 onClick={Home}>Khóa Học Trực Tuyến</h1>
        <div className={styles.userInfo}>
        {user ? (
            <>
              <p onClick={toggleDropdown} className={styles.userName}>
                {user.name}
              </p>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {(userRole.includes("admin") || userRole.includes("teacher")) && (
                    <>
                      <Link href="/CreateQuiz" className={styles.navLink}>
                        Tạo quiz
                      </Link>
                      <Link href={`/Calendar?teacher_id=${user.id}`} className={styles.navLink}>
                        Lịch dạy
                      </Link>
                    </>
                  )}
                
                  {userRole.includes("admin") && (
                    <>
                      <Link href="/User" className={styles.navLink}>
                        Users
                      </Link>
                      <Link href="/CreateCourse" className={styles.navLink}>
                        Tạo khóa học
                      </Link>
                      <Link href="/ListCourse" className={styles.navLink}>
                        Danh sách khóa học
                      </Link>
                    </>
                  )}
                </div>
              )}
              <button onClick={handleLogout} className={styles.logoutButton}>
                Đăng xuất
              </button>
            </>
          ) : (
            <Link href="/Login">
              <button className={styles.loginButton}>Đăng nhập</button>
            </Link>
          )}
        </div>
      </header>
      {user&&(
           <nav className={styles.nav}>
           <Link href="#courses">Danh sách khóa học</Link>
           <Link href="/ListQuiz">Làm quiz trực tuyến</Link>
           <Link href="#profile">Thông tin cá nhân</Link>
           <Link href="#payment">Thanh toán</Link>
         </nav>

        )}

            <div className={styles.container}>
                {isLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Đang tải thông tin khóa học...</p>
                    </div>
                ) : course ? (
                    <>
                        <div className={styles.courseDetail}>
                            <div className={styles.courseLayout}>
                                <div className={styles.courseImage}>
                                    {course.image ? (
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${course.image}`}
                                            alt={course.name}
                                            className={styles.image}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder-image.jpg';  
                                            }}
                                        />
                                    ) : (
                                        <div className={styles.noImage}>
                                            Chưa có ảnh
                                        </div>
                                    )}
                                </div>
                                <div className={styles.courseInfo}>
                                    <h2 className={styles.courseTitle}>{course.name}</h2>
                                    <div className={styles.infoList}>
                                        <p><strong>Giáo viên:</strong> {teacher?.name || 'Chưa có thông tin'}</p>
                                        <p><strong>Lịch:</strong> {course.schedule ? `${course.schedule.schedule_data.length} buổi/tuần` : 'Chưa có thông tin'}</p>
                                        <p><strong>Giá:</strong> {parseInt(course.price).toLocaleString('vi-VN')} VNĐ</p>
                                        <p><strong>Sĩ số tối đa:</strong> {course.max_students} học viên</p>
                                        <h2 className={styles.title}>Nội dung khóa học</h2>                                         
                                            <p>{course.detail || 'Chưa có mô tả'}</p>
                                    </div>
                                    {user && (
                                        <button className={styles.enrollButton}>
                                            Đăng ký ngay
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {course.video_url && (
                            <div className={styles.videoSection}>
                                <h3 className={styles.title}>Video giới thiệu</h3>
                                <div className={styles.videoContainer}>
                                    <div className={styles.videoWrapper}>
                                        <iframe
                                            width="100%"
                                            height="315"
                                            src={getVideo(course.video_url) || undefined}
                                            title="Course Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className={styles.mainInfo}>
                            <h2 className={styles.title}> Bài học</h2>
                            {tableOfContents.map((content,index) => (
                                <div className={styles.contentItem} key={content.id}>
                                    <h3 className={styles.contentTitle}>Bài {index+1}: {content.title}</h3>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className={styles.error}>
                        <p>Không tìm thấy thông tin khóa học</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailCourse;