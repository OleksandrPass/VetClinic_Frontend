import React, { useState } from "react";
import './WriteReview.css';
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect";
import StarRating from "../components/StarRating";

const WriteReview = () => {

    const [selectedService, setSelectedService] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);

    const navigate = useNavigate();

    const serviceOptions = [
        { value: '', label: 'Select a service' },
        { value: 'general_checkups', label: 'General Check-ups', id: '4bfce486-6dfa-4208-9c07-2cda20baaed9' },
        { value: 'vaccinations', label: 'Vaccinations', id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        { value: 'dental_care', label: 'Dental Care', id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a' },
        { value: 'grooming', label: 'Grooming', id: 'd9c5e6a7-8b7c-4def-8b7c-d9c5e6a78b7c' },
        { value: 'laboratory_tests', label: 'Laboratory Tests', id: 'e8d7c6b5-a9f8-4cde-a9f8-e8d7c6b5a9f8' },
        { value: 'nutritional_counseling', label: 'Nutritional Counseling', id: 'f7e6d5c4-b3a2-4cde-b3a2-f7e6d5c4b3a2' },
    ];

    const doctorOptions = [
        { value: '', label: 'Select a doctor' },
        { value: 'brooks', label: 'Dr. Olivia Brooks', id: 'ac87a42e-47f7-46c5-bf51-2d1992694d06' },
        { value: 'harrison', label: 'Dr. David Harrison', id: 'add09c39-ead2-4fa3-9835-d4b1a8a70370' },
        { value: 'reynolds', label: 'Dr. Michael Reynolds', id: 'cbffd235-9fa8-494f-8440-46a816317643' },
    ];

    // Function to get the service ID based on its value
    const getServiceId = (serviceValue) => {
        const service = serviceOptions.find(opt => opt.value === serviceValue);
        return service ? service.id : null;
    };

    // Function to get the doctor ID based on its value
    const getDoctorId = (doctorValue) => {
        const doctor = doctorOptions.find(opt => opt.value === doctorValue);
        return doctor ? doctor.id : null;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

    // Client-side validation
    if (!selectedService || !selectedDoctor || !reviewText.trim() || rating === 0) {
      alert('Please fill in all required fields and provide a rating.');
      return;
    }

    const serviceId = getServiceId(selectedService);
    const specialistId = getDoctorId(selectedDoctor);

    // Ensure IDs are correctly mapped
    if (!serviceId || !specialistId) {
      alert('Could not determine service or doctor ID. Please check the configuration.');
      return;
    }

    const reviewData = {
      service_id: serviceId,
      specialist_id: specialistId,
      rating: rating,
      comment: reviewText,
    };

    // --- Backend Integration Steps ---

    // 1. Get the authentication token (if your API requires it)
    // Based on your LogIn component, 'user-info' might contain the token.
    // You'll need to parse it and extract the actual token string.
    let authToken = null;
    try {
      const userInfo = JSON.parse(localStorage.getItem('user-info'));
      // Assuming the token is directly in userInfo or within a 'token' property
      authToken = userInfo?.token; // Adjust this based on your actual 'user-info' structure
    } catch (e) {
      console.error("Error parsing user-info from localStorage:", e);
    }


        const backendBaseUrl = 'https://vet-clinic-backend.ew.r.appspot.com/';
        const apiUrl = `${backendBaseUrl}/api/reviews`;

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            // 3. Add Authorization header if a token exists
            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`; // Common format for JWT tokens
            } else {
                alert('You must be logged in to submit a review.');
                return; // Stop the submission if no token is found
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(reviewData),
            });

            const responseData = await response.json(); // Parse the response from the server

            if (response.ok) {
                setSelectedService('');
                setSelectedDoctor('');
                setReviewText('');
                setRating(0);
                navigate("/review-submitted", { state: responseData.review });
            } else {

                alert(`Submission failed: ${responseData.message || 'Something went wrong while submitting the review.'}`);
                console.error('Review submission error:', responseData);
            }
        } catch (error) {
            console.error('Network or server error:', error);
            alert('A network error occurred. Please try again later.');
        }
    };

    return (
        <div>
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
                            <button type="submit" className="submit-review-btn" onClick={handleSubmit}>Submit Review</button>
                        </div>
                    </form>
                    <p className="review-required-note">* Indicates a required field</p>
                </main>
            </div>
        </div>
    );
};

export default WriteReview;