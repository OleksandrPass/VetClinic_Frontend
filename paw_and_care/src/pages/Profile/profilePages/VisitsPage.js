import React, { useEffect, useState } from 'react';
import SideMenu from '../../../components/sideMenu/sideMenu'; // Adjust the import path as needed
import AppointmentCard from '../../../components/PetCard/AppointmentCard'; // Adjust the path accordingly
import './VisitsPage.css';

const VisitsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedView, setSelectedView] = useState('future'); // State to toggle between views
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    const token = userInfo?.token;

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!token) {
                setError('User token is missing.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    'https://vet-clinic-backend.ew.r.appspot.com/api/appointments',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch appointments.');
                }

                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error('Unexpected response format.');
                }

                setAppointments(data);
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [token]);

    if (loading) return <div>Loading visits...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!appointments.length) return <div>No appointments found.</div>;

    const now = new Date();
    const previousAppointments = appointments.filter(
        (appointment) => new Date(`${appointment.date}T${appointment.time}`) < now
    );
    const futureAppointments = appointments.filter(
        (appointment) => new Date(`${appointment.date}T${appointment.time}`) >= now
    );

    const displayedAppointments =
        selectedView === 'previous' ? previousAppointments : futureAppointments;

    return (
        <div className="profile-content">
            <div className="visits-section">
                <div className="buttons-container">
                    <button
                        className={`toggle-button ${
                            selectedView === 'previous' ? 'active' : ''
                        }`}
                        onClick={() => setSelectedView('previous')}
                    >
                        Previous Appointments
                    </button>
                    <button
                        className={`toggle-button ${
                            selectedView === 'future' ? 'active' : ''
                        }`}
                        onClick={() => setSelectedView('future')}
                    >
                        Future Appointments
                    </button>
                </div>

                <div className="cards-container">
                    {displayedAppointments.length ? (
                        displayedAppointments.map((appointment) => (
                            <AppointmentCard key={appointment.id} appointment={appointment} />
                        ))
                    ) : (
                        <p>No {selectedView} appointments found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisitsPage;