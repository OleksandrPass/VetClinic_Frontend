import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import '../components/header/header.css';
import logo from '../assets/SVG/logo.svg';
import default_profile from "../assets/Лендинги/profile_picture.png";

const SpecialistReceptionistHeader = ({ setIsAuthenticated }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const getDisplayUserInfo = () => {
        const storedUserString = localStorage.getItem("user-info");
        if (!storedUserString) return null;

        try {
            const parsed = JSON.parse(storedUserString);
            if (parsed.profile) {
                return parsed.profile;
            }
            return parsed;
        } catch (e) {
            console.error("Failed to parse user-info from localStorage in SpecialistReceptionistHeader:", e);
            localStorage.removeItem('user-info');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            return null;
        }
    };

    const displayUserInfo = getDisplayUserInfo(); // Получаем данные для отображения

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
        localStorage.removeItem('user-info');
        localStorage.removeItem('token');
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
                <div className="specialist-buttons-wrapper">
                    <nav className="nav-links-d">
                        <NavLink to="/schedule" >Schedule</NavLink>
                        <NavLink to="/patients" >Patients</NavLink>
                    </nav>
                </div>

                <div className="nav-buttons">
                    {displayUserInfo && ( // Keep this check for robustness, even if routing prevents unauthenticated access
                        <div className="profile-dropdown-container" ref={dropdownRef}>
                            <div className={`profile-container ${open ? 'active' : ''}`} onClick={toggleDropdown}>
                                <img src={default_profile} className="profile-image" alt={'doctor profile'} />
                            </div>

                            {open && (
                                <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                                    <div className="dropdown-header">
                                        {/* Only show name and email */}
                                        <div className="user-name">{displayUserInfo.name || 'Admin Name'}</div>
                                        <div className="user-email">{displayUserInfo.email || 'admin@example.com'}</div>
                                    </div>

                                    <div className="dropdown-divider"></div>

                                    {/* Removed "My Profile" for admin, leaving Log out and Remove Account */}
                                    <button className="dropdown-item" onClick={logout}>Log out</button>
                                    <Link to="/remove-account" className="dropdown-item danger" onClick={e => e.stopPropagation()}>
                                        Remove Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
};

export default SpecialistReceptionistHeader;