﻿import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import './LogIn.css';
import { Link, useNavigate } from "react-router-dom";

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const getRedirectPath = (userType) => {
    if (userType === 'specialist') {
      return '/schedule';
    } else if (userType === 'admin') {
      return '/schedule_admin';
    } else {
      return '/about-us';
    }
  };

  useEffect(() => {
    const userInfoString = localStorage.getItem('user-info');
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        navigate(getRedirectPath(userInfo.userType));
      } catch (e) {
        console.error("Error parsing user-info from localStorage:", e);
        localStorage.removeItem('user-info');
      }
    }
  }, [navigate]);

  const logIn = async (e) => {
    e.preventDefault();

    const data = {
      email,
      password
    };

    try {
      const response = await fetch('https://vet-clinic-backend.ew.r.appspot.com/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('user-info', JSON.stringify(result));
        navigate(getRedirectPath(result.userType));
      }  else {
        alert("Login failed: " + result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <Header/>
      <div className="login-container">
        <main className="login-main">
          <h1 className="login-title">Log In</h1>
          <form className="login-form" onSubmit={logIn}> {/* Added onSubmit */}
            <div className="form-row">
              <div className="form-group">
                <label>Email*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password*</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={'forgot-password'}>
            <Link to = '/password-reset-request'><p>Forgot Password?</p></Link>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Submit</button>
              <Link to="/sign-up"><button type="button" className="signup-btn">Sign Up</button></Link>
            </div>
            <p className="required-note">* Indicates a required field</p>
          </form>
        </main>
      </div>
      <Footer/>
    </div>
  );
};

export default LogIn;