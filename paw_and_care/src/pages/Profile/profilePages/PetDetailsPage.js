import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../../../components/PetCard/PetCard.css';
import tick from '../../../assets/SVG/tick-circle.svg';
import back_arrow from '../../../assets/SVG/left-arrow.svg';
import edit_image from '../../../assets/SVG/edit_pet_image.svg';

const PetDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pet = location.state?.pet;
  const storedUser = localStorage.getItem("user-info");
  const user = storedUser ? JSON.parse(storedUser).profile : null;

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editedPet, setEditedPet] = useState({
    name: pet?.name || '',
    species: pet?.species || '',
    breed: pet?.breed || '',
    age: pet?.age || '',
    gender: pet?.gender || '',
    weight: pet?.weight || '',
  });

  if (!pet) {
    return (
        <div>
          <p>Pet data not available. Please return to the pet list.</p>
          <button onClick={() => navigate("/profile/pets")}>Go Back</button>
        </div>
    );
  }

  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user-info'))?.token;

      const response = await fetch(
          `https://vet-clinic-backend.ew.r.appspot.com/api/user/pets/${pet.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: editedPet.name,
              species: editedPet.species,
              breed: editedPet.breed,
              age: Number(editedPet.age),
              gender: editedPet.gender,
              weight: Number(editedPet.weight)
            })
          }
      );

      if (!response.ok) {
        throw new Error("Failed to update pet");
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error saving pet data.");
    }
  };

  const handleCancel = () => {
    setEditedPet({
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      age: pet.age || '',
      gender: pet.gender || '',
      weight: pet.weight || '',
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPet(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
      <div className="pet-details-page-container">
        <div className="pet-details-page">
          <div className="background-container"
               style={{
                 width: '100%',
                 height: '30vh',
                 backgroundImage: `url(${pet.photoUrl})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 position: 'relative',
               }}>
            <div className={'back-arrow'} onClick={() => navigate('/profile/pets')}><img src={back_arrow} alt="Go Back" className="back-arrow-icon" /></div>

            <img
                src={edit_image}
                alt={isEditing ? "Save" : "Edit"}
                className="edit-icon"
                onClick={() => setIsEditing(true)}
                style={{ cursor: 'pointer', width: '40px', position: 'absolute', top: 20, right: 20 }}
            />
          </div>

          <div className="pet-details-container">
            <div className="info-grid">
              <div className="info-column">
                <p><strong>Name:</strong><br />
                  {isEditing ? <input name="name" value={editedPet.name} onChange={handleChange} /> : pet.name}
                </p>
                <p><strong>Breed:</strong><br />
                  {isEditing ? <input name="breed" value={editedPet.breed} onChange={handleChange} /> : pet.breed}
                </p>
                <p><strong>Age:</strong><br />
                  {isEditing ? <input name="age" value={editedPet.age} onChange={handleChange} /> : pet.age}
                </p>
              </div>

              <div className="info-column">
                <p><strong>Species:</strong><br />
                  {isEditing ? <input name="species" value={editedPet.species} onChange={handleChange}/> : pet.species}
                </p>
                <p><strong>Gender:</strong><br />
                  {isEditing ? <input name="gender" value={editedPet.gender} onChange={handleChange} /> : pet.gender || 'N/A'}
                </p>
                <p><strong>Weight:</strong><br />
                  {isEditing ? <input name="weight" value={editedPet.weight} onChange={handleChange} /> : pet.weight || 'N/A'}
                </p>
              </div>

              <div className="info-column">
                <p><strong>Owner's name:</strong><br />{user?.name}</p>
                <p><strong>Phone number:</strong><br />{user?.phone || 'N/A'}</p>
                <p><strong>Email:</strong><br />{user?.email || 'N/A'}</p>
              </div>
            </div>

            {isEditing && (
                <div className="edit-buttons-container">
                  <button onClick={handleSave}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
            )}
          </div>
        </div>

        {showSuccess && (
            <div className="success-container">
              <img src={tick} alt="tick-circle" />
              <h3>Pet details updated successfully!</h3>
            </div>
        )}
      </div>
  );
};

export default PetDetailsPage;