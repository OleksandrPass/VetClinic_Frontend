import React, { useState } from 'react';
import './PetCard.css';
import logo from '../../assets/SVG/logo.svg';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PetCard = ({ pet, token, onPetUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...pet });
  const [photo, setPhoto] = useState(null);



  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/pets/${pet.id}`);
  }

  const handleUpdate = async () => {
    try {
      const res = await fetch(`https://vet-clinic-backend.ew.r.appspot.com/api/user/pets/${pet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update pet');

      if (photo) {
        const form = new FormData();
        form.append('photo', photo);

        const photoRes = await fetch(`https://vet-clinic-backend.ew.r.appspot.com/api/pets/${pet.id}/photo`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        });

        if (!photoRes.ok) throw new Error('Failed to upload photo');
      }

      onPetUpdated();
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link
      to={`/profile/pets/${pet.id}`}
      state={{ pet }}
      className="pet-card-link"
    >
      <div className="pet-card">
        <img
          src={pet.photoUrl || logo}
          alt={pet.name}
          className="pet-photo"
        />
        <div className="pet-info">
          <h3>{pet.name}</h3>
          <p><span>Species:</span> {pet.species}</p>
          <p><span>Breed:</span> {pet.breed}</p>
          <p><span>Gender:</span> {pet.gender || '—'}</p>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;
