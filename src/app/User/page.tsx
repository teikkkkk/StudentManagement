"use client";
import { useState, useEffect } from "react";
import styles from "../styles/User.module.css";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  created_at: string;
}

const ListUser = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: number]: string }>({});


  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Error fetching users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const updateUserRole = async (userId: number) => {
    const role = selectedRoles[userId];
    try {
      const response = await fetch(`http://localhost:8000/api/user/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roles: [role] }), 
      });
      if (response.ok) {
        fetchUsers(); 
      } else {
        console.error("Error updating user role:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };
  const handleHomeClick = () => {
    router.push('/Home');
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={handleHomeClick} className={styles.homeButton}>
          <FaHome size={20} />
        </button>
        <h1 className={styles.pageTitle}>User List</h1>
      </header>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={selectedRoles[user.id] || user.roles[0] || ''}  
                    onChange={(e) =>
                      setSelectedRoles((prev) => ({ ...prev, [user.id]: e.target.value }))
                    }
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td >
                  <button className={styles.button} onClick={() => updateUserRole(user.id)}>Save</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListUser;
