import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../pages/Profile/Profile.css';

const SideMenu = () => {
  const location = useLocation();

  // Retrieve the selected pet id from localStorage
  const selectedPetId = localStorage.getItem('selected-pet-id'); // Assume this key stores the pet id

  return (
      <div className="main-section">
        <div className="menu-container">
          <ul>
            <Link
                to="/profile/pets"
                className="pet-link"
                style={location.pathname === '/profile/pets'  ? { background: '#086788', color: 'white' } : {}}
            >
              <ol>Pet</ol>
            </Link>
            <Link
                to={selectedPetId ? `/profile/pets/${selectedPetId}/medical-record` : '/profile/pets'}
                className="med-records"
                style={location.pathname === `/profile/pets/${selectedPetId}/medical-record` ? { background: '#086788', color: 'white' } : {}}
            >
              <ol>Medical Records</ol>
            </Link>
            <Link
                to="/profile/visits"
                className="visits"
                style={location.pathname === '/profile/visits' ? { background: '#086788', color: 'white' } : {}}
            >
              <ol>Visits</ol>
            </Link>
          </ul>
        </div>
      </div>
  );
};

export default SideMenu;