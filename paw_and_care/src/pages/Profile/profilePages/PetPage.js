import React, { useEffect, useState } from 'react';
import PetCard from '../../../components/PetCard/PetCard';
import '../Profile.css';
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";

const PetPage = () => {
  const [pets, setPets] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem('user-info'));
  const token = userInfo?.token;

  const fetchPets = async () => {
    try {
      const res = await fetch('https://vetclinic-backend.ew.r.appspot.com/api/user/pets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const petList = Array.isArray(data) ? data : data.pets;
      setPets(petList || []);
    } catch (err) {
      console.error('Error fetching pets:', err);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div>
      <div className="profile-content">
      <h2>Profile</h2>
      <div className="pet-cards-container">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} token={token} onPetUpdated={fetchPets} />
        ))}
      </div>
    </div>
    </div>


  );
};

export default PetPage;
