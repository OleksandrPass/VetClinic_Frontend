import React from 'react';
import dayjs from 'dayjs';

const AppointmentCardD = ({ appointment }) => {
    const {
        date,
        time,
        pet_name,
        breed,
        service_id,
        status
    } = appointment;

    const normalizedStatus = status ? status.toLowerCase().replace(/ /g, '-') : 'unknown';

    let cardClass;
    if (normalizedStatus === 'canceled') {
        cardClass = 'appointment-card-d canceled';
    } else if (normalizedStatus === 'pending') {
        cardClass = 'appointment-card-d pending';
    } else if (normalizedStatus === 'on-time') {
        cardClass = 'appointment-card-d on-time';
    } else {
        cardClass = 'appointment-card-d unknown';
    }

    const getServiceReason = (serviceId) => {
    let cardClass;
    if (status === 'Canceled') {
        cardClass = 'appointment-card-d canceled';
    } else if (status === 'Pending') {
        cardClass = 'appointment-card-d pending';
    } else {
        cardClass = 'appointment-card-d on-time';
    }

    const getServiceReason = (serviceId) => {
        switch(serviceId) {
            case '4bfce486-6dfa-4208-9c07-2cda20baaed9': return 'General Check-ups';
            case 'f47ac10b-58cc-4372-a567-0e02b2c3d479': return 'Vaccinations';
            case 'c9bf9e57-1685-4c89-bafb-ff5af830be8a': return 'Dental Care';
            case 'd9c5e6a7-8b7c-4def-8b7c-d9c5e6a78b7c': return 'Grooming';
            case 'e8d7c6b5-a9f8-4cde-a9f8-e8d7c6b5a9f8': return 'Laboratory Tests';
            case 'f7e6d5c4-b3a2-4cde-b3a2-f7e6d5c4b3a2': return 'Nutritional Counseling';
            default: return 'Unknown Reason';
        }
    };

    const appointmentDate = dayjs(date);
    const dayOfWeek = appointmentDate.format('ddd').toUpperCase();
    const dayOfMonth = appointmentDate.format('D');
    const formattedTime = time ? time.substring(0, 5) : 'N/A';

    return (
        <div className={cardClass}>
            <div className="card-header">
                <span className="card-day-of-week">{dayOfWeek}</span>
                <span className="card-day-of-month">{dayOfMonth}</span>
            </div>
            <div className="card-body">
                <p className="card-time">{formattedTime}</p>
                <p className="card-detail">Name: <span className="card-value">{pet_name}</span></p>
                <p className="card-detail">Breed: <span className="card-value">{breed}</span></p>
                <p className="card-detail">Visit Reason: <span className="card-value">{getServiceReason(service_id)}</span></p>


                <span className={`card-status ${normalizedStatus}`}>
                <span className={`card-status ${status ? status.toLowerCase().replace(' ', '-') : 'unknown'}`}>
                    {status || 'Unknown'}
                </span>
            </div>
        </div>
    );
};

export default AppointmentCardD;