import React from 'react';
import Header from './header'; // For regular users/clients
import SpecialistReceptionistHeader from '../header_d'

const HeaderRouter = () => {
    const storedUser = localStorage.getItem("user-info");
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    const userType = userInfo?.userType || "guest"; // fallback to 'guest' if undefined

    // Adjust this condition based on your roles
    if (userType === "doctor") {
        return <SpecialistReceptionistHeader />;
    } if (userType === "receptionist") {
        return <SpecialistReceptionistHeader />;
    }
    return <Header />;
};

export default HeaderRouter;
