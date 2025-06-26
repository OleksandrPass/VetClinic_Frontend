import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const AppointmentCardD = ({ appointment }) => {
    const {
        date = '',
        time = '',
        pet_name = 'Unknown',
        breed = 'Unknown',
        service_id = '',
        status = 'Unknown',
    } = appointment || {};

    const statusMap = {
        canceled: 'canceled',
        pending: 'pending',
        'on-time': 'on-time',
    };
    const normalizedStatus = status ? statusMap[status.toLowerCase()] || 'unknown' : 'unknown';

    const cardClass = `appointment-card-d ${normalizedStatus}`;

    const getServiceReason = (serviceId) => {
        const reasons = {
            '4bfce486-6dfa-4208-9c07-2cda20baaed9': 'General Check-ups',
            'f47ac10b-58cc-4372-a567-0e02b2c3d479': 'Vaccinations',
            'c9bf9e57-1685-4c89-bafb-ff5af830be8a': 'Dental Care',
            'd9c5e6a7-8b7c-4def-8b7c-d9c5e6a78b7c': 'Grooming',
            'e8d7c6b5-a9f8-4cde-a9f8-e8d7c6b5a9f8': 'Laboratory Tests',
            'f7e6d5c4-b3a2-4cde-b3a2-f7e6d5c4b3a2': 'Nutritional Counseling',
        };
        return reasons[serviceId] || 'Unknown Reason';
    };

    const appointmentDate = dayjs(date);
    const dayOfWeek = appointmentDate.isValid() ? appointmentDate.format('ddd').toUpperCase() : 'N/A';
    const dayOfMonth = appointmentDate.isValid() ? appointmentDate.format('D') : 'N/A';
    const formattedTime = time ? time.substring(0, 5) : 'N/A';

    return (
        <div className={cardClass} aria-label={`Appointment card for ${pet_name}`}>
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
                    {status || 'Unknown'}
                </span>
            </div>
        </div>
    );
};

AppointmentCardD.propTypes = {
    appointment: PropTypes.shape({
        date: PropTypes.string.isRequired,
        time: PropTypes.string,
        pet_name: PropTypes.string,
        breed: PropTypes.string,
        service_id: PropTypes.string,
        status: PropTypes.string,
    }).isRequired,
};

export default AppointmentCardD;