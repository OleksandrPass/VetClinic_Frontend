import React from 'react';
import Header from './header'; // For regular users/clients
import SpecialistReceptionistHeader from '../header_d'
// import HeaderAdmin from "./header_admin";

const HeaderRouter = () => {
    const storedUser = localStorage.getItem("user-info");
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    const userType = userInfo?.userType || "guest";

    if (userType === "doctor") {
        return <SpecialistReceptionistHeader />;
    // } if (userType === "admin") {
    //     return <HeaderAdmin />;
    }
    return <Header />;
};

export default HeaderRouter;