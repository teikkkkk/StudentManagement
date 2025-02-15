'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from './DataUser.module.css';
import { FaHome } from 'react-icons/fa';

interface User {
    name: string;
    email: string;
    gender: string;
    image: string;
    id: string;
}

const DataUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string[]>([]);
    const [image, setImage] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedGender, setEditedGender] = useState('');
    const router = useRouter();

    useEffect(() => {
        const userData = Cookies.get("user");
        if (userData) {
            const userFromCookie = JSON.parse(userData) as User;
            setImage(userFromCookie.image);
            if (userFromCookie.id) {
                fetchUserInfo(userFromCookie.id);
            }
        }
    }, []);

    useEffect(() => {
        if (user) {
            setEditedName(user.name);
            setEditedGender(user.gender);
        }
    }, [user]);

    const fetchUserInfo = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/info?provider_id=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user info');
            const data = await response.json();
            setUserRole(data.roles);
            setUser(data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleSave = async () => {
        const userData = Cookies.get("user");
        if (!userData) return;
        const userFromCookie = JSON.parse(userData) as User;
        const userId = userFromCookie.id;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user?provider_id=${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editedName,
                    gender: editedGender,
                }),
            });

            if (!response.ok) throw new Error('Failed to update user info');

            setUser(prev => prev ? {...prev, name: editedName, gender: editedGender} : null);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user info:', error);
        }
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
                <h1 className={styles.pageTitle}>Thông tin cá nhân</h1>
            </header>
            <div className={styles.profileContainer}>
                <div className={styles.profileCard}>
                    <div className={styles.profileLayout}>
                        <div className={styles.profileImageContainer}>
                            <img src={image || '/default-avatar.png'} alt="User Avatar" className={styles.profileImage} />
                        </div>
                        <div className={styles.profileInfo}>
                            <h1 className={styles.profileTitle}>Thông tin cá nhân</h1>
                            <div className={styles.profileDetails}>
                                <div className={styles.profileField}>
                                    <label className={styles.profileLabel}>Họ và tên:</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className={styles.editInput}
                                        />
                                    ) : (
                                        <p className={styles.profileValue}>{user?.name}</p>
                                    )}
                                </div>
                                <div className={styles.profileField}>
                                    <label className={styles.profileLabel}>Email:</label>
                                    <p className={styles.profileValue}>{user?.email}</p>
                                </div>
                                <div className={styles.profileField}>
                                    <label className={styles.profileLabel}>Giới tính:</label>
                                    {isEditing ? (
                                        <select
                                            value={editedGender}
                                            onChange={(e) => setEditedGender(e.target.value)}
                                            className={styles.editInput}
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="nam">Nam</option>
                                            <option value="nữ">Nữ</option>
                                        </select>
                                    ) : (
                                        <p className={styles.profileValue}>{user?.gender || 'Chưa cập nhật'}</p>
                                    )}
                                </div>
                                <div className={styles.profileField}>
                                    <label className={styles.profileLabel}>Vai trò:</label>
                                    <div className={styles.profileRoles}>
                                        {userRole.map((role, index) => (
                                            <span key={index} className={styles.profileRoleBadge}>
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.buttonContainer}>
                                {isEditing ? (
                                    <>
                                        <button onClick={handleSave} className={styles.saveButton}>
                                            Lưu
                                        </button>       
                                        <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
                                            Hủy
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className={styles.editButton}>
                                        Chỉnh sửa
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataUser;