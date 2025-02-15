"use client"; 

import { useState } from "react";
import Link from "next/link";
import axios from 'axios';
import styles from '../styles/Login.module.css';  

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        const response = await axios.post("http://localhost:8000/api/login", { phone, password });
        if (response.data.success) {
          window.location.href = "http://localhost:8000/home";  
        }else{
            alert('aldsjlkf');
        }
  };
  return (
    <div className={styles.container}>
      <div className={styles.userCard}>
        <div className={styles.heading}>
          <h1>Forgot PassWord</h1>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <span className={styles.inputGroupText}>📞</span>
              <input
                type="phone"
                name="phone"
                className={styles.inputUser}
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <button onClick={handleSubmit} className={styles.loginButton}>
                Login
              </button>
            </div>
          <div className={styles.links}>
          <span>
            <Link href="/Login" legacyBehavior>
              <a className={styles.link}> Back to Login</a>
            </Link>
          </span>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;