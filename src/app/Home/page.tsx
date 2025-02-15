"use client";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import Cookies from 'js-cookie';  

interface User {
  name: string;
  email: string;
  id: string; 
  roles: string[]; 
}
interface Course {
  id: string;
  name: string;
  detail: string;

}
const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string[]>([]); 
  const [courses, setCourses] = useState<Course[]>([]); 
  const router = useRouter();

  useEffect(() => {
    const userData = Cookies.get("user");  
    if (userData) {
      const userFromCookie = JSON.parse(userData) as User;
      
      if (userFromCookie.id) {
        fetchUserInfo(userFromCookie.id); 
      } else {
        console.error("User ID is undefined.");
      }
    }
    fetchCourses();
  }, []);
  const fetchUserInfo = async (userId: string) => { 
    try {
      const response = await fetch(`http://localhost:8000/api/user/info?provider_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const data = await response.json();
      
      setUser(data);
      setUserRole(data.roles); 
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  const handleLogout = async () => {
    Cookies.remove("user"); 
    Cookies.remove("role");
    setUser(null);
    setUserRole([]);  
    await signOut();
    router.push("/Login");
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1>Khóa Học Trực Tuyến</h1>
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
           <Link href="/DataUser">Thông tin cá nhân</Link>
           <Link href="#payment">Thanh toán</Link>
         </nav>

        )}
      <div className={styles.container}>
      <section id="courses" className={styles.courseList}>
        {courses.map((course) => (
          <div key={course.id} className={styles.course}>
            <h3>{course.name}</h3>
            <p>{course.detail}</p>
            <a href={`/DetailCourse?courseId=${course.id}`} className={styles.button}>
              Xem khóa học
            </a>
          </div>
        ))}
      </section>
        <section id="profile" className={styles.profile}>
          <h2 className={styles.Title}>Thông Tin Cá Nhân</h2>
          <a href="#" className={styles.button}>Cập nhật thông tin</a>      
        </section>
        <section id="payment" className={styles.payment}>
          <h2 className={styles.Title}>Thanh Toán</h2>
          <p className={styles.Text}>Chọn phương thức thanh toán cho các khóa học đã đăng ký:</p>
          <a href="#" className={styles.button}>Chuyển khoản ngân hàng</a>
          <p className={styles.Text}>Thanh toán bằng chuyển khoản hoặc tiền mặt.</p>
          <a href="#" className={styles.button}>Thanh toán bằng tiền mặt</a>
        </section>
      </div>
      <footer className={styles.footer}>
        <p>&copy; 2024 Khóa Học Trực Tuyến. Mọi quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default Home;
