import React from 'react';
import ReactDOM from 'react-dom/client';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Header from '../components/header';
import './RequestAppointment.css';
import Footer from '../components/footer';
import AppointmentCalendar from "../components/AppointmentCalendar";
import { useState } from 'react';
import CustomSelect from '../components/CustomSelect';
import { useNavigate } from 'react-router-dom';


const RequestAppointment = () => {

const navigate = useNavigate();

const [fullName, setFullName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [species, setSpecies] = useState('');
const [breed, setBreed] = useState('');
const [agree, setAgree] = useState(false);
const [selectedDate, setSelectedDate] = useState(null);
const [selectedTime, setSelectedTime] = useState(null);
const [reason, setReason] = useState('');
const [specialist, setSpecialist] = useState('');

const handleRequest = () => {
    if (
        fullName.trim() === '' ||
        email.trim() === '' ||
        species.trim() === '' ||
        breed.trim() === '' ||
        reason === '' ||
        specialist === '' ||
        !selectedDate ||
        !selectedTime ||
        !agree
    ) {
        alert("Please fill in all required fields and select a date & time.");
        return;
    }

    navigate('/request-success');
};
    const reasonOptions = [
        { value: '', label: '' },
        { value: 'general_checkups', label: 'General Check-ups' },
        { value: 'vaccinations', label: 'Vaccinations' },
        { value: 'dental_care', label: 'Dental Care' },
        { value: 'grooming', label: 'Grooming' },
        { value: 'laboratory_tests', label: 'Laboratory Tests' },
        { value: 'nutritional_counseling', label: 'Nutritional Counseling' },
    ];

    const specialistOptions = [
        { value: '', label: '' },
        { value: 'brooks', label: 'Dr. Olivia Brooks' },
        { value: 'harrison', label: 'Dr. David Harrison' },
        { value: 'reynolds', label: 'Dr. Michael Reynolds' },
    ];

    return (
        <div>
            <Header />
            <h3>Request Appointment</h3>
            <div className="request-appointment">
                <div className="form-section">
                    <div className="form-wrapper">
                        <form className="appointment-form">
                            <div className="form-group single">
                                <label>Full Name*</label>
                                <input type="text"
                                       value={fullName}
                                       onChange={(e) => setFullName(e.target.value)}
                                       required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email*</label>
                                    <input type="email"
                                           value={email}
                                           onChange={(e) => setEmail(e.target.value)}
                                           required />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel"
                                           value={phone}
                                           onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Species*</label>
                                    <input type="text"
                                           value={species}
                                           onChange={(e) => setSpecies(e.target.value)}
                                           required />
                                </div>
                                <div className="form-group">
                                    <label>Breed*</label>
                                    <input type="text"
                                           value={breed}
                                           onChange={(e) => setBreed(e.target.value)}
                                           required />
                                </div>
                            </div>

                            <div className="form-group single">
                                <label>Reason for Appointment*</label>
                                <CustomSelect
                                    label="Reason for Appointment"
                                    options={reasonOptions}
                                    required={true}
                                    value={reason}
                                    onChange={setReason}
                                />
                            </div>

                            <div className="form-group single">
                                <label>Choose a Specialist*</label>
                                <CustomSelect
                                    label="Choose a Specialist"
                                    options={specialistOptions}
                                    required={true}
                                    value={specialist}
                                    onChange={setSpecialist}
                                />
                            </div>
                        </form>
                    </div>

                    <div className="checkbox-wrapper">
                        <label className="form-checkbox">
                            <input type="checkbox"
                                   checked={agree}
                                   onChange={(e) => setAgree(e.target.checked)}
                                   required />
                            <span className="checkbox-text">
                                By registering, I acknowledge that I have read and agree to the
                                <a href="#"> Terms of Service</a> and <a href="#">Privacy Policy</a>.
                            </span>
                        </label>
                    </div>

                    <div className="request-wrapper">
                        <button type="button" className="request-btn" onClick={handleRequest}>Request</button>
                    </div>

                    <p className="required-note">* Indicates a required field</p>
                </div>

                <div className="calendar-section">
                    <AppointmentCalendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                    />
                </div>
            </div>

            <Footer />
        </div>

    );
};

export default RequestAppointment;