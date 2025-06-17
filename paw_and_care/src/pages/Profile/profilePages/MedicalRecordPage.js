import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Profile.css';

const MedicalRecordPage = () => {
  const { petId } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const token = userInfo?.token;


  useEffect(() => {
    const fetchMedicalRecords = async () => {
      if (!token) {
        setError("Authentication token missing.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://vet-clinic-backend.ew.r.appspot.com/api/pets/${petId}/records`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch medical records.");
        }

        const data = await res.json();
        setRecords(data || []);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching medical records.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [petId, token]);

  if (loading) return <div className="med-records-loading">Loading medical records...</div>;
  if (error) return <div className="med-records-error">{error}</div>;

  return (
    <div className="medical-record-page">
      <h2>Medical Records</h2>
      {records.length === 0 ? (
        <p>No medical records found for this pet.</p>
      ) : (
        <ul className="record-list">
          {records.map((record) => (
            <li key={record.id} className="record-card">
              <h3>{record.title}</h3>
              <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
              <p><strong>Type:</strong> {record.type}</p>
              <p><strong>Notes:</strong> {record.notes}</p>
              {/* Add more fields if available */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicalRecordPage;
