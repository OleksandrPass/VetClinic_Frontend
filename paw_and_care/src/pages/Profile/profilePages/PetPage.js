import React, { useEffect, useState } from "react";
import PetCard from "../../../components/PetCard/PetCard";

const PetPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const token = userInfo?.token;

  useEffect(() => {
    const fetchPets = async () => {
      if (!token) {
        console.error("No token found.");
        return;
      }

      try {
        const res = await fetch("https://vet-clinic-backend.ew.r.appspot.com/api/user/pets", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const petsData = await res.json();

        if (!Array.isArray(petsData)) {
          console.warn("Unexpected pets format:", petsData);
          return;
        }

        // Fetch photo for each pet and attach it
        const petsWithPhotos = await Promise.all(
          petsData.map(async (pet) => {
            try {
              const photoRes = await fetch(`https://vet-clinic-backend.ew.r.appspot.com/api/pets/${pet.id}/photo`, {
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Accept": "image/jpeg",
                },
              });

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

        setPets(petsWithPhotos);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-content">
      <div className="pet-cards-container">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
};

export default PetPage;