import React, { useEffect, useState } from "react";
import PetCard from "../components/PetCard/PetCardAdmin";
import "./Patients.css";

const AdminPage = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    const token = userInfo?.token;

    useEffect(() => {
        const fetchAndStorePets = async () => {
            try {
                const res = await fetch("https://vet-clinic-backend.ew.r.appspot.com/api/pets/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const petsData = await res.json();

                if (!Array.isArray(petsData)) {
                    console.warn("Unexpected pets format:", petsData);
                    return;
                }

                const petsWithPhotos = await Promise.all(
                    petsData.map(async (pet) => {
                        try {
                            const photoRes = await fetch(
                                `https://vet-clinic-backend.ew.r.appspot.com/api/pets/${pet.id}/photo`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        Accept: "image/jpeg",
                                    },
                                }
                            );

                            if (photoRes.ok) {
                                const blob = await photoRes.blob();
                                const photoUrl = URL.createObjectURL(blob);
                                return { ...pet, photoUrl };
                            } else {
                                return { ...pet, photoUrl: null };
                            }
                        } catch (err) {
                            console.error(`Error loading photo for pet ${pet.id}`, err);
                            return { ...pet, photoUrl: null };
                        }
                    })
                );

                // Save the retrieved pets to localStorage
                localStorage.setItem("admin-pets-data", JSON.stringify(petsWithPhotos));

                setPets(petsWithPhotos);
            } catch (err) {
                console.error("Failed to fetch pets:", err);
            }
        };

        const loadPets = async () => {
            setLoading(true);

            let cachedPets = localStorage.getItem("admin-pets-data");

            if (cachedPets) {
                cachedPets = JSON.parse(cachedPets);
                setPets(cachedPets);
                setLoading(false);
            } else {
                await fetchAndStorePets();
                setLoading(false);
            }
        };

        if (token) {
            loadPets();
        } else {
            console.error("No token found.");
            setLoading(false);
        }
    }, [token]);

    if (loading) return <div>Loading all pets...</div>;

    return (
        <div className="doctor-content">
            <div className="pet-cards-container">
                {pets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} token={token} />
                ))}
            </div>
        </div>
    );
};

export default AdminPage;