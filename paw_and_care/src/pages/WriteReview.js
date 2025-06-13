import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import './WriteReview.css';
import {useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect";
import StarRating from "../components/StarRating";

const WriteReview = () => {

    const [selectedService, setSelectedService] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();

    const serviceOptions = [
        { value: '', label: '' },
        { value: 'general_checkups', label: 'General Check-ups' },
        { value: 'vaccinations', label: 'Vaccinations' },
        { value: 'dental_care', label: 'Dental Care' },
        { value: 'grooming', label: 'Grooming' },
        { value: 'laboratory_tests', label: 'Laboratory Tests' },
        { value: 'nutritional_counseling', label: 'Nutritional Counseling' },
    ];

    const doctorOptions = [
        { value: '', label: '' },
        { value: 'brooks', label: 'Dr. Olivia Brooks' },
        { value: 'harrison', label: 'Dr. David Harrison' },
        { value: 'reynolds', label: 'Dr. Michael Reynolds' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedService || !selectedDoctor || !reviewText.trim() || rating === 0) {
            alert('Please fill in all required fields and leave a rating.');
            return;
        }
        const reviewData = {
            service: selectedService,
            doctor: selectedDoctor,
            review: reviewText,
            rating,
        };

        localStorage.setItem("review", JSON.stringify(reviewData));

        navigate("/review-submitted", { state: reviewData });
    };

    return (
        <div>
            <Header/>
            <div className="review-container">
                <main className="review-main">
                    <h1 className="login-title">Write A Review</h1>
                    <form className="review-form review-form-custom" onSubmit={handleSubmit} >
                        <div className="review-form-group">
                            <label>Services*</label>
                            <CustomSelect
                                options={serviceOptions}
                                value={selectedService}
                                onChange={setSelectedService}
                                required
                            />
                        </div>
                        <div className="review-form-group">
                            <label>Doctor*</label>
                            <CustomSelect
                                options={doctorOptions}
                                value={selectedDoctor}
                                onChange={setSelectedDoctor}
                                required
                            />
                        </div>
                        <div className="review-form-group single">
                            <label>Write your review here*</label>
                            <textarea
                                className="review-textarea"
                                required
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />
                        </div>
                        <div className="review-form-group">
                            <StarRating rating={rating} setRating={setRating} />
                        </div>
                        <div className="review-wrapper">
                            <button type="submit" className="submit-review-btn" >Submit Review</button>
                        </div>
                    </form>
                    <p className="review-required-note">* Indicates a required field</p>
                </main>
            </div>
            <Footer/>
        </div>
    );
};

export default WriteReview;