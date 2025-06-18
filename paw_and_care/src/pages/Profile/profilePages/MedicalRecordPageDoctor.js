import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Profile.css';
import './MedicalRecordPageDoctor.css';
import file from '../../../assets/SVG/file_icon.svg';
import download from '../../../assets/SVG/download.svg';

const MedicalRecordPageDoctor = () => {
    const { petId } = useParams();
    const [medicalRecord, setMedicalRecord] = useState({
        medical_information: '',
        allergies: [''],
        previous_diagnoses: [''],
        prescriptions: ['']
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchMedicalRecord = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `https://vet-clinic-backend.ew.r.appspot.com/api/pets/${petId}/medical-record`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch medical record.');
            }

            const data = await response.json();

            if (!data || Object.keys(data).length === 0) {
                setMedicalRecord({
                    medical_information: '',
                    allergies: [''],
                    previous_diagnoses: [''],
                    prescriptions: ['']
                });
            } else {
                setMedicalRecord(data);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicalRecord();
    }, [petId]);

    const handleChange = (field, index = null) => (e) => {
        const value = e.target.value;
        if (index !== null) {
            setMedicalRecord(prev => {
                const updated = [...prev[field]];
                updated[index] = value;
                return { ...prev, [field]: updated };
            });
        } else {
            setMedicalRecord(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleAddField = (field) => {
        setMedicalRecord(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `https://vet-clinic-backend.ew.r.appspot.com/api/pets/${petId}/medical-record`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(medicalRecord)
                }
            );

            if (!response.ok) throw new Error('Failed to update medical record.');

            setIsEditing(false);
            setSuccessMessage('Medical record updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to update medical record.');
        }
    };

    if (loading) return <p>Loading medical record...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div className="profile-content-doctor">
            <div className="medical-record-container">
                <div className="med-info-container">
                    <div className="med-information">
                        <strong>Medical Information:</strong><br />
                        {isEditing ? (
                            <textarea
                                value={medicalRecord.medical_information}
                                onChange={handleChange('medical_information')}
                            />
                        ) : (
                            <ul><li>{medicalRecord.medical_information || 'No information'}</li></ul>
                        )}
                    </div>

                    <div className="allergies-container">
                        <strong>Allergies:</strong>
                        <ul>
                            {medicalRecord.allergies?.map((item, i) =>
                                isEditing ? (
                                    <li key={i}>
                                        <input value={item} onChange={handleChange('allergies', i)} />
                                    </li>
                                ) : (
                                    <li key={i}>{item || 'None'}</li>
                                )
                            )}
                        </ul>
                        {isEditing && (
                            <button onClick={() => handleAddField('allergies')}>+ Add Allergy</button>
                        )}
                    </div>

                    <div className="previous-diagnoses">
                        <strong>Previous Diagnoses:</strong>
                        <ul>
                            {medicalRecord.previous_diagnoses?.map((item, i) =>
                                isEditing ? (
                                    <li key={i}>
                                        <input value={item} onChange={handleChange('previous_diagnoses', i)} />
                                    </li>
                                ) : (
                                    <li key={i}>{item || 'None'}</li>
                                )
                            )}
                        </ul>
                        {isEditing && (
                            <button onClick={() => handleAddField('previous_diagnoses')}>+ Add Diagnosis</button>
                        )}
                    </div>

                    <div className="prescriptions">
                        <strong>Prescriptions:</strong>
                        <ul>
                            {medicalRecord.prescriptions?.map((item, i) =>
                                isEditing ? (
                                    <li key={i}>
                                        <input value={item} onChange={handleChange('prescriptions', i)} />
                                    </li>
                                ) : (
                                    <li key={i}>{item || 'None'}</li>
                                )
                            )}
                        </ul>
                        {isEditing && (
                            <button onClick={() => handleAddField('prescriptions')}>+ Add Prescription</button>
                        )}
                    </div>
                </div>

                <div className="last-updated">
                    <p><strong>Last check-in:</strong> {medicalRecord.createdAt ? new Date(medicalRecord.createdAt).toLocaleDateString() : 'Unknown'}</p>
                </div>

                <div className={'med-buttons'}>
                    {isEditing ? (
                        <>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => { setIsEditing(false); fetchMedicalRecord(); }}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>Edit Record</button>
                    )}
                </div>

                {successMessage && <p className={'green-message'}>{successMessage}</p>}
            </div>

            <div className="med-files">
                <h2>Medical Prescriptions</h2>
                <div className="link1">
                    <img src={file} alt="file icon" />
                    <p>Prescription for antibiotics</p>
                    <a
                        href="https://www.metlifepetinsurance.com/blog/pet-health/antibiotics-for-dogs/"
                        target="_blank" rel="noreferrer"
                    >
                        <img src={download} className="download" alt="download icon" />
                    </a>
                </div>
                <div className="link2">
                    <img src={file} alt="file icon" />
                    <p>Prescription for glaucoma drops</p>
                    <a
                        href="https://www.vetrxdirect.com/product/view/dorzolamide-eye-drops-for-dogs-and-cats-rx"
                        target="_blank" rel="noreferrer"
                    >
                        <img src={download} className="download2" alt="download icon" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordPageDoctor;
