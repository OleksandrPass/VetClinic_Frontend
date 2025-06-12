import React, { useState } from 'react';
import './PetCard.css';

const PetCard = ({ pet, token, onPetUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...pet });
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`https://vetclinic-backend.ew.r.appspot.com/api/user/pets/${pet.id}`, {
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

        const photoRes = await fetch(`https://vetclinic-backend.ew.r.appspot.com/api/pets/${pet.id}/photo`, {
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
    <div className="pet-card">
      <div className="pet-image">
        <img
          src={pet.photo_url || '/placeholder.jpg'}
          alt={pet.name}
        />
        {editing && <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />}
      </div>

      <div className="pet-info">
        {editing ? (
          <>
            <input name="name" value={formData.name} onChange={handleChange} />
            <input name="species" value={formData.species} onChange={handleChange} />
            <input name="breed" value={formData.breed} onChange={handleChange} />
            <input name="age" value={formData.age || ''} onChange={handleChange} />
            <input name="weight" value={formData.weight || ''} onChange={handleChange} />
            <input name="gender" value={formData.gender || ''} onChange={handleChange} />
            <button className="save-btn" onClick={handleUpdate}>Save</button>
            <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h3>{pet.name}</h3>
            <p>Species: {pet.species}</p>
            <p>Breed: {pet.breed}</p>
            <p>Age: {pet.age || '—'}</p>
            <p>Weight: {pet.weight || '—'}</p>
            <p>Gender: {pet.gender || '—'}</p>
            <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PetCard;
