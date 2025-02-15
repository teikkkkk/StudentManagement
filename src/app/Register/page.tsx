'use client';
 import { useState } from 'react';
 import axios from 'axios';
 import styles from '../styles/Register.module.css';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[showPassword, setShowPassword] = useState(false);
  const[error, setError] = useState("");
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try{
        const response = await axios.post("http://localhost:8000/api/register", {
          firstName, lastName, phone, email, password});
        if(response.data.success){
            window.location.href = "http://localhost:3000/Login";
        }else{
            setError(response.data.message);
        }
    }catch(err){
        setError("Đăng ký thất bại");
        console.error(err);
    }
  };
    return (
         <div className={styles.container}>
          <div className={styles.userCard}>
              <div className={styles.heading}>
                <h1>Lets Register Account</h1>
                <p>Hello user, you have <br/>a greatful journey</p>
              </div>
              {error && <p className={styles.errorMessage}>{error}</p>}
              <div className={styles.form}>
                <form onSubmit={handleRegister}>
                  <div  className={styles.inputGroup}>
                    <input type="text"
                    name="firstName"
                    className={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                     />
                  </div>
                  <div className={styles.inputGroup}>
                    <input type="text"
                    name="lastName"
                    className={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                     />
                  </div>
                  <div className={styles.inputGroup}>
                    <input type="text"
                    name="phone"
                    className={styles.input}
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                     />
                  </div>
                  <div className={styles.inputGroup}>
                    <input type="email"
                    name="email"
                    className={styles.input}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={styles.input}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                  <button type="submit" className={styles.button}>Sign in</button>
                </form>
              </div>
              <div className={styles.links}>
                <span>Already have an account? <Link href="/Login">Login</Link></span>
              </div>
          </div>
         </div>
    )
}

export default RegisterPage;
