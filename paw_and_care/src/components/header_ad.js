import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import '../components/header/header.css';
import logo from '../assets/SVG/logo.svg'; // Make sure this path is correct now
import AppointmentButton from "./buttons/appointmentButton";
import default_profile from "../assets/Лендинги/profile_picture.png";

const AdminHeader = ({ setIsAuthenticated }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Universal logic to get user info for display
    const getDisplayUserInfo = () => {
        const storedUserString = localStorage.getItem("user-info");
        if (!storedUserString) return null;

        try {
            const parsed = JSON.parse(storedUserString);
            // If userType is 'admin' and name/email are directly in the root object
            if (parsed.userType === 'admin' && (parsed.name || parsed.email)) {
                return parsed; // Return the root object
            }
            // Otherwise, if there's a nested 'profile' (like for regular users, doctors, receptionists)
            else if (parsed.profile) {
                return parsed.profile;
            }
            // Fallback: return the whole parsed object if no specific profile or direct data
            return parsed;
        } catch (e) {
            console.error("Failed to parse user-info from localStorage in AdminHeader:", e);
            localStorage.removeItem('user-info');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            return null;
        }
    };

    const displayUserInfo = getDisplayUserInfo(); // Get the data for display

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
                <div className="links-container">
                    <nav className="nav-links">
                        <NavLink to="/schedule_admin">Schedule</NavLink>
                        <NavLink to="/patients_admin">Patients</NavLink>
                        <NavLink to="/services">Services</NavLink>
                        <NavLink to="/contact">Contact</NavLink>
                    </nav>
                </div>

                <div className="nav-buttons">
                    {/* Wrapped AppointmentButton in its own container */}
                    <div className="appointment-button-container">
                        <AppointmentButton/>
                    </div>

                    {/* We assume that if this header renders, the admin is already logged in */}
                    {displayUserInfo && ( // Keep this check for robustness, even if routing prevents unauthenticated access
                        <div className="profile-dropdown-container" ref={dropdownRef}>
                            <div className={`profile-container ${open ? 'active' : ''}`} onClick={toggleDropdown}>
                                <img src={default_profile} className="profile-image" alt={'admin profile'} />
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

export default AdminHeader;