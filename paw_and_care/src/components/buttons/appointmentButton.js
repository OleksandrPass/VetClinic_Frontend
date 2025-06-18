import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './appointmentButton.css';

const AppointmentButton = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    try {
      const userInfoString = localStorage.getItem('user-info');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setUserType(userInfo.userType);
      } else {
        setUserType('guest');
      }
    } catch (e) {
      console.error("Error parsing user-info from localStorage in AppointmentButton:", e);
      setUserType('guest');
    }
  }, []);

  const targetPath = (userType === 'admin' )
      ? '/admin/request-appointment'
      : '/request-appointment';

  return (
      <div className="appointment-btn">
        <Link to={targetPath}>
          <button className="orange-btn">Request Appointment</button>
        </Link>
      </div>
  );
}

export default AppointmentButton;