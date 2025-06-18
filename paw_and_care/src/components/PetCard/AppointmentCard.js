import React from 'react';
import './PetCard.css'
const AppointmentCard = ({ appointment }) => {
    const {
        date,
        time,
        status,
        pet_name,
        species,
        breed,
        full_name,
        specialist,
    } = appointment;

    return (
        <div className="appointment-card">
            <p>
                {date}
            </p>
            <p>
                {time}
            </p>
            <p>
                <strong>Pet Name:</strong> {pet_name} ({species} - {breed})
            </p>
            <p>
                <strong>Owner:</strong> {full_name}
            </p>
            <p>
                <strong>Specialist:</strong> {specialist.name}
            </p>
        </div>
    );
};

export default AppointmentCard;