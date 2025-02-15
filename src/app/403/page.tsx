// pages/403.tsx
import styles from '../styles/Forbidden.module.css';
import Link from 'next/link';

export default function ForbiddenPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.errorCode}>403</h1>
            <p className={styles.message}>Bạn không có quyền truy cập vào trang này.</p>
            <Link href="/Home">
                <h5 className={styles.homeLink}>Quay về trang chủ</h5>
            </Link>
        </div>
    );
}
