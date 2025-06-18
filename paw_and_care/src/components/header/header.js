import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import logo from '../../assets/SVG/logo.svg';
import AppointmentButton from "../buttons/appointmentButton";
import SignUpButton from "../buttons/signUpButton";
import default_profile from "../../assets/Лендинги/profile_picture.png";

const Header = ({ setIsAuthenticated }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const storedUserString = localStorage.getItem("user-info");
  let userInfo = null;
  if (storedUserString) {
    try {
      const parsed = JSON.parse(storedUserString);
      userInfo = parsed.profile || parsed;
    } catch (e) {
      console.error("Failed to parse user-info from localStorage:", e);
      localStorage.removeItem('user-info');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
     
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('user-info');
    localStorage.removeItem('token');
    localStorage.removeItem('pets-data');
    localStorage.removeItem('selected-pet-id');
    localStorage.removeItem('user-profile');
    localStorage.removeItem('admin-pets-data');
    setIsAuthenticated(false);
    navigate('/log-in');
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <div className="header-container">
      <header className="header">
        <div className="logo-container">
          <Link to="/"><img src={logo} alt="Paw & Care" className="logo" /></Link>
          <span className="brand-name"><Link to="/">Paw & Care</Link></span>
        </div>
        <div className="links-container">
          <nav className="nav-links">
            <Link to="/about-us">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        <div className="nav-buttons">
          <AppointmentButton/>
          {userInfo ? (
            <div className="profile-dropdown-container" ref={dropdownRef}>
              <div className={`profile-container ${open ? 'active' : ''}`} onClick={toggleDropdown}>
                <img src={default_profile} className="profile-image" alt={'profile'} />
              </div>

              {open && (
                <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <div className="user-name">{userInfo.name || 'User Name'}</div>
                    <div className="user-email">{userInfo.email || 'user@example.com'}</div>
                    <div className="user-phone">{userInfo.phone || '+123 456 789'}</div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <Link to="/profile/pets" className="dropdown-item" onClick={e => e.stopPropagation()}>
                    My Profile
                  </Link>
                  <button className="dropdown-item" onClick={logout}>Log out</button>
                  <Link to="/remove-account" className="dropdown-item danger" onClick={e => e.stopPropagation()}>
                    Remove Account
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <SignUpButton/>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
