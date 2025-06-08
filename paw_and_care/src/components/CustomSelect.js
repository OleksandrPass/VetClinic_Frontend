import React, { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';
import arrowIcon from '../assets/SVG/arrow-up-340-svgrepo-com.svg';

const CustomSelect = ({ options, value, onChange, placeholder, required }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();

    // Закрыть селект при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionClick = (optionValue) => {
        onChange(optionValue);
        //setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="custom-select" ref={ref}>
            <div
                className={`select-header ${isOpen ? 'open' : ''} ${required && !value ? 'error' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                tabIndex={0}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setIsOpen(!isOpen);
                    }
                }}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {selectedOption ? selectedOption.label : placeholder}
                <span className={`arrow ${isOpen ? 'open' : ''}`}>
                    <img src={arrowIcon} alt="arrow" className="arrow-icon" />
                </span>
            </div>

            {isOpen && (
                <ul className="select-options" role="listbox">
                    {options
                        .filter(opt => opt.value !== '')  // исключаем пустую опцию
                        .map(opt => (
                            <li
                                key={opt.value}
                                className={`select-option ${opt.value === value ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(opt.value)}
                                role="option"
                                aria-selected={opt.value === value}
                                tabIndex={0}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleOptionClick(opt.value);
                                    }
                                }}
                            >
                                {opt.label}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;