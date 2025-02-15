'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import axios from 'axios';
import styles from '../styles/Login.module.css';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleNumberPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/api/login", { phone, password });
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = "http://localhost:3000/Home";
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Số điện thoại hoặc mật khẩu không đúng');
      console.error(err);
    }
  };

  const handleLoginGoogle = async () => {
    try {
      const res = await signIn("google", { redirect: false });
      if (res?.error) {
        console.error("Error during login:", res.error);
        return;
      }
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      Cookies.set("user", JSON.stringify(session.user), {
        expires: 1,
        secure: true,
        sameSite: 'Strict'
      });
      Cookies.set("role", JSON.stringify(session.user.role), {
        expires: 1,
        secure: true,
        sameSite: 'Strict'
      });
      window.location.href = "/Home";
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.userCard}>
        <div className={styles.heading}>
          <h1>Lets Sign you in</h1>
          <p>Welcome Back,<br/> You have been missed</p>
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.formContainer}>
          <form onSubmit={handleNumberPhone}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="phone"
                className={styles.input}
                placeholder="Email, phone & username"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                name="password"
                className={styles.input}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.forgotPassword}>
              <Link href="/ForgotPassword">Forgot Password?</Link>
            </div>
            <button type="submit" className={styles.signInButton}>
              Sign in
            </button>
          </form>
        </div>
        <div className={styles.orContainer}>
          <span>or</span>
        </div>
        <div className={styles.socialButtons}>
          <button onClick={handleLoginGoogle} className={styles.googleButton}>
            <FaGoogle />
          </button>
          <button className={styles.facebookButton}>
            <FaFacebook />
          </button>
        </div>
        <div className={styles.links}>
          <span>
            Don&apos;t have an account? <Link href="/Register">Register Now</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
 