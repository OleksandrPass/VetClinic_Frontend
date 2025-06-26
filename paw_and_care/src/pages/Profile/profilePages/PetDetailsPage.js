import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import '../../../components/PetCard/PetCard.css';
import tick from '../../../assets/SVG/tick-circle.svg';
import edit_image from '../../../assets/SVG/edit_pet_image.svg';

const PetDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pet = location.state?.pet;
  const storedUser = localStorage.getItem("user-info");
  const user = storedUser ? JSON.parse(storedUser).profile : null;

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(pet?.photoUrl);
  const [editedPet, setEditedPet] = useState({
    name: pet?.name || '',
    species: pet?.species || '',
    breed: pet?.breed || '',
    age: pet?.age || '',
    gender: pet?.gender || '',
    weight: pet?.weight || '',
  });

  const fileInputRef = useRef();

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
    setPhotoUrl(pet.photoUrl);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPet(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const token = JSON.parse(localStorage.getItem('user-info'))?.token;

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
          `https://vet-clinic-backend.ew.r.appspot.com/api/pets/${pet.id}/photo`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData
          }
      );

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      // Generate a temporary local URL to display the new image
      const blob = await response.blob();
      const newPhotoUrl = URL.createObjectURL(blob);
      setPhotoUrl(newPhotoUrl);
    } catch (error) {
      console.error('Photo upload failed:', error);
      alert('Failed to upload new photo.');
    }
  };

  return (
      <div className="pet-details-page-container">
        <div className="pet-details-page">
          <div
              className="background-container"
              style={{
                width: '100%',
                height: '30vh',
                backgroundImage: `url(${photoUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                cursor: isEditing ? 'pointer' : 'default',
              }}
              onClick={() => {
                if (isEditing) {
                  fileInputRef.current.click();
                }
              }}
          >
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
            />

            <img
                src={edit_image}
                alt={isEditing ? "Save" : "Edit"}
                className="edit-icon"
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering file input
                  setIsEditing(true);
                }}
                style={{
                  cursor: 'pointer',
                  width: '40px',
                  position: 'absolute',
                  top: 20,
                  right: 20
                }}
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
                  {isEditing ? <input name="species" value={editedPet.species} onChange={handleChange} /> : pet.species}
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
            <div className="success-container-pet-details">
              <h3>Pet details updated successfully!</h3>
            </div>
        )}
      </div>
  );
};

export default PetDetailsPage;
