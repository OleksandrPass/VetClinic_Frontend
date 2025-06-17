import React, { useState } from 'react';
import starFilled from '../assets/SVG/star-filled.svg';
import starEmpty from '../assets/SVG/star-empty.svg';
import './StarRating.css';

const StarRating = ({ rating, setRating }) => {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((starValue) => (
                <img
                    key={starValue}
                    src={starValue <= (hovered || rating) ? starFilled : starEmpty}
                    alt={`${starValue} star`}
                    className="star"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHovered(starValue)}
                    onMouseLeave={() => setHovered(0)}
                />
            ))}
        </div>
    );
};

export default StarRating;