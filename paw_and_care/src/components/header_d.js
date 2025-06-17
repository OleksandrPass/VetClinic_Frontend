import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import './header.css'; // Используем тот же CSS файл
import logo from '../assets/SVG/logo.svg';
import profile_picture_test from "../assets/Img Docktor/Doktor 1.jpg.jpg";


const SpecialistReceptionistHeader = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const logout = (e) => {
        e.stopPropagation();
        localStorage.removeItem('user-info');
        navigate('/log-in');
    };

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

    const userInfo = localStorage.getItem('user-info')
        ? JSON.parse(localStorage.getItem('user-info'))
        : null;

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setOpen(!open);
    };

    return (
        <div className="header-container">
            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="Paw & Care" className="logo" />
                    <span className="brand-name">Paw & Care</span>
                </div>
                <div className="specialist-buttons-wrapper">
                    <nav className="nav-links-d">
                        <NavLink to="/schedule" >Schedule</NavLink>
                        <NavLink to="/patients" >Patients</NavLink>
                    </nav>
                </div>

                <div className="nav-buttons">
                    <div className="profile-dropdown-container" ref={dropdownRef}>
                        <div className={`profile-container ${open ? 'active' : ''}`} onClick={toggleDropdown}>
                            <img src={profile_picture_test} className="profile-image" alt={'profile picture'}/>
                            <div className={`menu-trigger ${open ? 'active' : ''}`} onClick={toggleDropdown}>
                                {/*<img src={arrow} className={"arrow-icon" } alt={'arrow-icon'}/> */}
                            </div>
                        </div>

                        {open && (
                            <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                                <div className="dropdown-header">
                                    <div className="user-name">{userInfo.name || 'User Name'}</div>
                                    <div className="user-email">{userInfo.email || 'user@example.com'}</div>
                                </div>

                                <div className="dropdown-divider"></div>

                                <button className="dropdown-item" onClick={logout}>Log out</button>
                                <Link to="/remove-account" className="dropdown-item danger" onClick={e => e.stopPropagation()}>
                                    Remove Account
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </div>
    );
};

export default SpecialistReceptionistHeader;