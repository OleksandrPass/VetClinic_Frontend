import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpecialistReceptionistHeader from '../components/header_d';
import './Schedule.css';
import  arrowLeft from '../assets/SVG/ar-left.svg'
import  arrowRight from '../assets/SVG/ar-right.svg'

const AppointmentCard = ({ date, time, name, breed, reason, status }) => {
    const cardClass = status === 'Canceled' ? 'appointment-card canceled' : 'appointment-card on-time';

    return (
        <div className={cardClass}>
            <div className="card-header">
                <span className="card-day-of-week">{date.dayOfWeek}</span>
                <span className="card-day-of-month">{date.dayOfMonth}</span>
            </div>
            <div className="card-body">
                <p className="card-time">{time}</p>
                <p className="card-detail">Name: <span className="card-value">{name}</span></p>
                <p className="card-detail">Breed: <span className="card-value">{breed}</span></p>
                <p className="card-detail">Visit Reason: <span className="card-value">{reason}</span></p>

                <span className={`card-status ${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
            </div>
        </div>
    );
};


const Schedule = () => {

    const testAppointment = {
        date: { dayOfWeek: 'MON', dayOfMonth: 5 },
        time: '10:00 - 11:00',
        name: 'Roxy',
        breed: 'Doberman',
        reason: 'Regular Check-up',
        status: 'On Time',
    };

    const navigate = useNavigate();

    useEffect(() => {
        const userInfoString = localStorage.getItem('user-info');
        let userType = null;

        if (userInfoString) {
            try {
                const userInfo = JSON.parse(userInfoString);
                userType = userInfo.userType;
            } catch (e) {
                console.error("Error parsing user-info from localStorage:", e);
                localStorage.removeItem('user-info');
            }
        }

        /*if (!userInfoString || userType !== 'specialist') {
            alert("You do not have permission to view this page. Only specialists can access this content.");
            navigate('/log-in');
        }*/
    }, [navigate]);



    return (
        <div className="schedule-page-container">

            <div className="schedule-content">
                <div className="month-navigation">
                    <button className="nav-arrow">
                        <img src={arrowLeft} alt="Previous Month" />
                    </button>
                    <span className="current-month">March</span> {/* Пока просто текст "March" */}
                    <button className="nav-arrow">
                        <img src={arrowRight} alt="Next Month" />
                    </button>
                </div>

                <div className="appointments-grid">
                    <AppointmentCard {...testAppointment} />
                </div>
            </div>
        </div>
    );
};

export default Schedule;