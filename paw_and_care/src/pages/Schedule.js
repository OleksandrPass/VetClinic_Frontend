import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Schedule.css';
import dayjs from 'dayjs';
import arrowLeft from '../assets/SVG/ar-left.svg';
import arrowRight from '../assets/SVG/ar-right.svg';

import AppointmentCardD from '../components/AppointmentCardD';

const Schedule = () => {
    const navigate = useNavigate();
    const [allAppointments, setAllAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentMonth, setCurrentMonth] = useState(dayjs());

    useEffect(() => {
        const filterAppointments = () => {
            const startOfMonth = currentMonth.startOf('month');
            const endOfMonth = currentMonth.endOf('month');

            const filtered = allAppointments.filter(appointment => {
                const appointmentDate = dayjs(appointment.date);
                return appointmentDate.isBetween(startOfMonth, endOfMonth, null, '[]');
            });
            setFilteredAppointments(filtered);
        };

        filterAppointments();
    }, [allAppointments, currentMonth]);

    useEffect(() => {
        const fetchSpecialistAppointments = async () => {
            setLoading(true);
            setError(null);

            const userInfoString = localStorage.getItem('user-info');
            let token = null;
            let userType = null;

            if (userInfoString) {
                try {
                    const userInfo = JSON.parse(userInfoString);
                    token = userInfo.token;
                    userType = userInfo.userType;
                } catch (e) {
                    console.error("Error parsing user-info from localStorage:", e);
                    setError("Failed to parse user information. Please log in again.");
                    localStorage.removeItem('user-info');
                    setLoading(false);
                    navigate('/log-in'); // Перенаправляем на страницу входа
                    return;
                }
            }

            // Проверка на наличие токена и типа пользователя
            if (!token || userType !== 'doctor') {
                alert("You do not have permission to view this page. Only specialists can access this content.");
                navigate('/log-in');
                setLoading(false);
                return;
            }

            try {
                // Используем эндпоинт для получения назначений специалиста
                const response = await fetch('https://vet-clinic-backend.ew.r.appspot.com/api/specialist/appointments', {
                    method: 'GET',
                    headers: {
                        'Accept': '*/*',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: response.statusText }));
                    if (response.status === 401 || (errorData.message && errorData.message.includes('Token expired'))) {
                        setError("Your session has expired. Please log in again.");
                        alert("Your session has expired. Please log in again.");
                        navigate('/log-in');
                    } else {
                        setError(`Error fetching appointments: ${errorData.message || response.statusText}`);
                    }
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                if (!Array.isArray(data)) {
                    setError("Unexpected data format from server. Expected an array of appointments.");
                    setAllAppointments([]);
                } else {
                    setAllAppointments(data);
                }

            } catch (err) {
                console.error("Network or unexpected error fetching appointments:", err);
                setError(`An unexpected error occurred: ${err.message}. Please try again.`);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialistAppointments();
    }, [navigate]);

    const goToPreviousMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, 'month'));
    };

    const goToNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, 'month'));
    };

    if (loading) {
        return (
            <div className="schedule-page-container">
                <div className="schedule-content">
                    <p>Loading appointments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="schedule-page-container">
                <div className="schedule-content">
                    <p className="error-message" style={{ color: 'red' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="schedule-page-container">
            {/* Если у вас есть общий заголовок или меню для специалиста, его можно оставить здесь */}
            {/* <SpecialistReceptionistHeader /> */}

            <div className="schedule-content">
                <div className="month-navigation">
                    <button className="nav-arrow" onClick={goToPreviousMonth}>
                        <img src={arrowLeft} alt="Previous Month" />
                    </button>
                    <span className="current-month">{currentMonth.format('MMMM YYYY')}</span>
                    <button className="nav-arrow" onClick={goToNextMonth}>
                        <img src={arrowRight} alt="Next Month" />
                    </button>
                </div>

                <div className="appointments-grid">
                    {filteredAppointments.length > 0 ? ( // Используем отфильтрованные записи
                        filteredAppointments.map((appointment) => (
                            <AppointmentCardD key={appointment.id} appointment={appointment} />
                        ))
                    ) : (
                        <p>No appointments found for you.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Schedule;