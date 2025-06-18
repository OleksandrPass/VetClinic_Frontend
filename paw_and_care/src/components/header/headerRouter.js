import React from 'react';
import Header from './header'; // For regular users/clients
import SpecialistReceptionistHeader from '../header_d'
import AdminHeader from "../header_ad";

const HeaderRouter = ({ setIsAuthenticated }) => {
    const storedUser = localStorage.getItem("user-info");
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    const userType = userInfo?.userType || "guest"; // fallback to 'guest' if undefined

    if (userType === "admin") {
        return <AdminHeader setIsAuthenticated={setIsAuthenticated} />;
    } else if (userType === "doctor" ) {
        return <SpecialistReceptionistHeader setIsAuthenticated={setIsAuthenticated} />;
    } else {
        return <Header setIsAuthenticated={setIsAuthenticated} />;
    }
};

export default HeaderRouter;
