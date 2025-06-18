import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import '../../../components/PetCard/PetCard.css';
import tick from '../../../assets/SVG/tick-circle.svg';
import back_arrow from '../../../assets/SVG/left-arrow.svg';
import edit_image from '../../../assets/SVG/edit_pet_image.svg';

const PetDetailsPageAdmin = () => {
    const { petId } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [pet, setPet] = useState(null);
    const [editedPet, setEditedPet] = useState({});
    const [owner, setOwner] = useState({});
    const [photoUrl, setPhotoUrl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const petsData = JSON.parse(localStorage.getItem("admin-pets-data"));
        if (!petsData || !Array.isArray(petsData)) return;

        const foundPet = petsData.find(p => p.id.toString() === petId);
        if (!foundPet) return;

        setPet(foundPet);
        setEditedPet({
            name: foundPet.name || '',
            species: foundPet.species || '',
            breed: foundPet.breed || '',
            age: foundPet.age || '',
            gender: foundPet.gender || '',
            weight: foundPet.weight || '',
        });
        setOwner(foundPet.owner || {});
        setPhotoUrl(foundPet.photoUrl || null);
    }, [petId]);

    if (!pet) {
        return (
            <div>
                <p>Pet data not available. Please return to the pet list.</p>
                <button onClick={() => navigate("/patients/pets")}>Go Back</button>
            </div>
        );
    }

    const handlePhotoClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('petPhoto', file);

        try {
            const token = JSON.parse(localStorage.getItem('user-info'))?.token;

            const uploadResponse = await fetch(
                `https://vet-clinic-backend.ew.r.appspot.com/api/pets/${pet.id}/photo`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!uploadResponse.ok) throw new Error('Failed to upload photo');

            const detailsResponse = await fetch(
                `https://vet-clinic-backend.ew.r.appspot.com/api/user/pets/${pet.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!detailsResponse.ok) throw new Error('Failed to fetch updated pet details');

            const updatedPet = await detailsResponse.json();

            setPhotoUrl(updatedPet.photoUrl || photoUrl);
            setEditedPet({
                name: updatedPet.name,
                species: updatedPet.species,
                breed: updatedPet.breed,
                age: updatedPet.age,
                gender: updatedPet.gender,
                weight: updatedPet.weight,
            });

            alert('Photo updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Error occurred while updating photo.');
        }
    };

    const handleSave = async () => {
        if (Object.values(editedPet).some(val => val === '')) {
            alert('Please fill in all fields.');
            return;
        }

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
                        ...editedPet,
                        age: Number(editedPet.age),
                        weight: Number(editedPet.weight),
                    }),
                }
            );

            if (!response.ok) throw new Error('Failed to update pet');

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert('Error saving pet data.');
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
        setEditedPet(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="pet-details-page-container">
            <div className="pet-details-page">
                <div
                    className="background-container"
                    onClick={handlePhotoClick}
                    style={{
                        width: '100%',
                        height: '30vh',
                        backgroundImage: `url(${photoUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        cursor: isEditing ? 'pointer' : 'default',
                    }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                    />
                    <div className="back-arrow" onClick={() => navigate('/profile/pets')}>
                        <img src={back_arrow} alt="Go Back" className="back-arrow-icon" />
                    </div>
                    <img
                        src={edit_image}
                        alt="Edit"
                        className="edit-icon"
                        onClick={() => setIsEditing(true)}
                        // style={{ width: '40px', position: 'absolute', top: 20, right: 20 }}
                    />
                </div>

                <div className="pet-details-container">
                    <div className="info-grid">
                        <div className="info-column">
                            <p><strong>Name:</strong><br />
                                {isEditing
                                    ? <input required name="name" value={editedPet.name} onChange={handleChange} />
                                    : pet.name}
                            </p>
                            <p><strong>Breed:</strong><br />
                                {isEditing
                                    ? <input required name="breed" value={editedPet.breed} onChange={handleChange} />
                                    : pet.breed}
                            </p>
                            <p><strong>Age:</strong><br />
                                {isEditing
                                    ? <input required name="age" type="number" value={editedPet.age} onChange={handleChange} />
                                    : pet.age}
                            </p>
                        </div>

                        <div className="info-column">
                            <p><strong>Species:</strong><br />
                                {isEditing
                                    ? <input required name="species" value={editedPet.species} onChange={handleChange} />
                                    : pet.species}
                            </p>
                            <p><strong>Gender:</strong><br />
                                {isEditing
                                    ? <input required name="gender" value={editedPet.gender} onChange={handleChange} />
                                    : pet.gender}
                            </p>
                            <p><strong>Weight:</strong><br />
                                {isEditing
                                    ? <input required name="weight" type="number" value={editedPet.weight} onChange={handleChange} />
                                    : pet.weight}
                            </p>
                        </div>

                        <div className="info-column">
                            <p><strong>Owner's name:</strong><br />{owner?.name || 'N/A'}</p>
                            <p><strong>Phone number:</strong><br />{owner?.phone || 'N/A'}</p>
                            <p><strong>Email:</strong><br />{owner?.email || 'N/A'}</p>
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
                <div className="edited-container">
                    <img src={tick} alt="tick-circle" />
                    <h3>Pet details updated successfully!</h3>
                </div>
            )}
        </div>
    );
};

export default PetDetailsPageAdmin;
