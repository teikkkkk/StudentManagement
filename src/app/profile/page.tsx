'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import './datauser.css';

interface UserInfo {
    name: string;
    email: string;
    roles: string[];
    gender: string;
    image: string;
}

export default function ProfilePage() {
    const { data: session } = useSession();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (session?.user?.id) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/info?provider_id=${session.user.id}`);
                    if (!response.ok) {
                        throw new Error('Không thể tải thông tin người dùng');
                    }
                    const data = await response.json();
                    setUserInfo(data);
                }
            } catch (error) {
                console.error('Lỗi khi tải thông tin:', error);
                toast.error('Không thể tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [session]);

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!userInfo) {
        return (
            <div className="error-container">
                <div className="error-content">
                    <h1 className="error-title">Không tìm thấy thông tin người dùng</h1>
                    <p className="error-message">Vui lòng đăng nhập lại</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-layout">
                    <div className="profile-image-container">
                        <div className="profile-image-wrapper">
                            <Image
                                src={userInfo.image || '/default-avatar.png'}
                                alt={userInfo.name}
                                fill
                                className="profile-image"
                            />
                        </div>
                    </div>
                    <div className="profile-info">
                        <div className="profile-title">
                            Thông tin cá nhân
                        </div>
                        <div className="profile-details">
                            <div className="profile-field">
                                <label className="profile-label">Họ và tên:</label>
                                <p className="profile-value">{userInfo.name}</p>
                            </div>
                            <div className="profile-field">
                                <label className="profile-label">Email:</label>
                                <p className="profile-value">{userInfo.email}</p>
                            </div>
                            <div className="profile-field">
                                <label className="profile-label">Giới tính:</label>
                                <p className="profile-value">{userInfo.gender || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="profile-field">
                                <label className="profile-label">Vai trò:</label>
                                <div className="profile-roles">
                                    {userInfo.roles.map((role, index) => (
                                        <span
                                            key={index}
                                            className="profile-role-badge"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 