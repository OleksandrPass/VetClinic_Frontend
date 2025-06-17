import React, { useState } from 'react';
import './Contact.css';
import phone from '../assets/SVG/call.svg';
import mail from '../assets/SVG/mail.svg';
import facebook from "../assets/SVG/small_facebook.svg";
import location from '../assets/SVG/location_on.svg';
import clock from '../assets/SVG/clock.svg';

const ContactPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [accepted, setAccepted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim() || !accepted) {
            alert("Please fill in all required fields.");
            return;
        }
        alert("Form submitted successfully!");
        setName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setMessage('');
        setAccepted(false);
    };


    return (
        <div>
            <div className="contact-page-container">
                <div className="contact-info-box">
                    <h2>Contact Us</h2>
                    <ul>
                        <li><img src={phone} alt={phone}/> +48 22 123 45 674</li>
                        <li><img src={mail} alt={mail}/> hello@pawandcare.com</li>
                        <li><img src={facebook} alt={facebook}/> PawCareService</li>
                        <li><img src={location} alt={location}/> ul. Kwiatowa 12, 60-123 Poznań, Poland</li>
                        <li>
                            <img src={clock} alt="clock"/>
                            <div className="time-text">
                                08:00 – 20:00
                                <span className="custom-text">
                                    (Monday - Saturday) <br/>
                                    <strong>Sunday</strong>: Closed / Emergency Appointments Only
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="contact-form-box">
                    <h3>Have a Question?</h3>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="contact-form-row">
                            <div className="contact-form-group">
                                <label>Name*</label>
                                <input type="text"
                                       value={name}
                                       onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="contact-form-group">
                                <label>Last Name</label>
                                <input type="text"
                                       value={lastName}
                                       onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="contact-form-group">
                            <label>Email*</label>
                            <input type="email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="contact-form-group">
                            <label>Phone Number</label>
                            <input type="tel"
                                   value={phoneNumber}
                                   onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="contact-form-group single">
                            <label>How can we help you?*</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="checkbox-wrapper">
                            <label className="appointment-form-checkbox">
                                <input type="checkbox"
                                       checked={accepted}
                                       onChange={(e) => setAccepted(e.target.checked)}
                                />
                                <span className="appointment-checkbox-text">
                                By registering, I acknowledge that I have read and agree to the
                                <a href="#"> Terms of Service</a> and <br/>
                                <a href="#">Privacy Policy</a>. I consent to the processing of my data as outlined in the <a
                                    href="#">Privacy Policy</a>.
                            </span>
                            </label>
                        </div>
                        <div className="contact-wrapper">
                            <button type="submit" className="submit-contact-btn">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="map-container">
                <iframe
                    src="https://www.bing.com/maps/embed?h=335&w=1200&cp=52.415796~16.928869&lvl=17&typ=d&sty=r&src=SHELL&FORM=MBEDV8"
                    style={{
                        border: 0,
                        width: '100%',
                        height: '100%',
                        display: 'block',
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

        </div>
    );
};

export default ContactPage;