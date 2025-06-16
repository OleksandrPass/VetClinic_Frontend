import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './CustomerReviews.css';
import filledStarSVG from '../assets/SVG/small_filled_star.svg';
import emptyStarSVG from '../assets/SVG/small_empty_star.svg';
import leftArrowSVG from '../assets/SVG/left_arrow.svg';
import rightArrowSVG from '../assets/SVG/right_arrow.svg';

const ReviewCard = ({ name, rating, reviewText, dateOfReview }) => {
    const renderStars = (numStars) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            const starImageSrc = i < numStars ? filledStarSVG : emptyStarSVG;
            stars.push(
                <span key={i} className="star">
                    <img
                        src={starImageSrc}
                        alt={i < numStars ? "Filled Star" : "Empty Star"}
                        className="star-icon"
                    />
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="review-card">
            <div className="review-header">
                <p className="reviewer-name">{name}</p>
                <div className="star-rating">{renderStars(rating)}</div>
                <p className="review-date">Date of Review: {dateOfReview}</p>
            </div>
            <p className="review-text">{reviewText}</p>
        </div>
    );
};

const CustomerReviewsCarousel = () => {
    const reviewsRef = useRef(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollability = () => {
        if (reviewsRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = reviewsRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const staticReviews = [
                    {
                        id: '1',
                        name: 'Maria',
                        rating: 5,
                        reviewText: 'Amazing staff and caring doctors. My dog Max is usually nervous at the vet, but here he\'s calm and relaxed. I\'m so grateful for the gentle approach!',
                        dateOfReview: '04-12-2023',
                    },
                    {
                        id: '2',
                        name: 'Kara',
                        rating: 4,
                        reviewText: 'Fast service and professional care. They handled my cat Luna\'s vaccination quickly and painlessly. I trust them completely with her health.',
                        dateOfReview: '02-03-2024',
                    },
                    {
                        id: '3',
                        name: 'Micha',
                        rating: 5,
                        reviewText: 'Clean clinic, friendly receptionists, and top-notch treatment. The whole place feels warm and welcoming. I always leave with peace of mind knowing my pet is in good hands.',
                        dateOfReview: '06-01-2024',
                    },
                    {
                        id: '4',
                        name: 'Ira',
                        rating: 5,
                        reviewText: 'They truly care about your pet\'s well-being. When my rabbit got sick, they reacted quickly and gave him the best treatment. I couldn\'t ask for a better vet!',
                        dateOfReview: '06-01-2024',
                    },
                    {
                        id: '5',
                        name: 'Micha',
                        rating: 4,
                        reviewText: 'Very good place to take your pets. Highly recommend!',
                        dateOfReview: '10-02-2024',
                    },
                ];
                await new Promise(resolve => setTimeout(resolve, 500));
                setReviews(staticReviews);
                setLoading(false);
            } catch (err) {
                setError("Failed to load reviews.");
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    useEffect(() => {
        const currentReviewsRef = reviewsRef.current;
        if (currentReviewsRef) {
            currentReviewsRef.addEventListener('scroll', updateScrollability);
            const timer = setTimeout(updateScrollability, 0);

            return () => {
                currentReviewsRef.removeEventListener('scroll', updateScrollability);
                clearTimeout(timer);
            };
        }
    }, [reviews]);

    const scrollReviews = (direction) => {
        if (reviewsRef.current) {
            const scrollAmount = 370;
            if (direction === 'left') {
                reviewsRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                reviewsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (loading) return <div className="loading-message">Loading reviews...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="reviews-section-wrapper">
            <div className="reviews-container">
                <div className="reviews-inner">
                    <h3>Customer Reviews</h3>
                    <div className="navigational-buttons">
                        <button
                            onClick={() => scrollReviews('left')}
                            className={`nav-button ${canScrollLeft ? 'active-scroll' : ''}`}
                            disabled={!canScrollLeft}
                        >
                            <img
                                src={leftArrowSVG}
                                alt="Scroll Left"
                                className="nav-icon"
                            />
                        </button>
                        <button
                            onClick={() => scrollReviews('right')}
                            className={`nav-button ${canScrollRight ? 'active-scroll' : ''}`}
                            disabled={!canScrollRight}
                        >
                            <img
                                src={rightArrowSVG}
                                alt="Scroll Right"
                                className="nav-icon"
                            />
                        </button>
                    </div>
                    <div className="reviews-collection" ref={reviewsRef}>
                        <div className="review-cards-wrapper">
                            {reviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    name={review.name}
                                    rating={review.rating}
                                    reviewText={review.reviewText}
                                    dateOfReview={review.dateOfReview}
                                />
                            ))}
                        </div>
                    </div>
                    <Link to="/write-a-review" className="write-review-link">
                        <button className="write-review-button">
                            Write a Review
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CustomerReviewsCarousel;
