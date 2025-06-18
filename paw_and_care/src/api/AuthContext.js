import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const stored = localStorage.getItem('user-info');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const stored = localStorage.getItem('user-info');
            setUserInfo(stored ? JSON.parse(stored) : null);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (info) => {
        localStorage.setItem('user-info', JSON.stringify(info));
        setUserInfo(info);
    };

    const logout = () => {
        localStorage.removeItem('user-info');
        localStorage.removeItem('token');
        setUserInfo(null);
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
