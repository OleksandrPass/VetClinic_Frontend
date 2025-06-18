import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Profile.css';
import file from '../../../assets/SVG/file_icon.svg'
import download from '../../../assets/SVG/download.svg'

const MedicalRecordPage = () => {
    const { petId } = useParams();
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setMedicalRecord(null);
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

    if (loading) return <p>Loading medical record...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (!medicalRecord) return <p>No medical record found for this pet.</p>;

    return (
        <div className="profile-content">

        <div className="medical-record-container">
            {/*<h2>Medical Record</h2>*/}
            <div className="med-info-container">
                {/* All medical info, allergies, diagnoses, etc., go here */}
                <div className="med-information">
                    <strong>Medical Information:</strong> <br/>
                    <ul> <li>{medicalRecord.medical_information}</li></ul>

                </div>
                <div className="allergies-container">
                    <p>
                        <strong>Allergies:</strong>
                    </p>

                    <ul><li>{medicalRecord.allergies?.join(', ') || 'None'}</li></ul>
                </div>
                <div className="previous-diagnoses">
                    <strong>Previous Diagnoses:</strong>
                    <ul>
                        {Array.isArray(medicalRecord.previous_diagnoses) &&
                            medicalRecord.previous_diagnoses.map((diagnosis, index) => (
                                <li key={index}>{diagnosis}</li>
                            ))}
                    </ul>
                </div>
                <div className={"prescriptions"}>
                    <strong>Prescriptions</strong>
                    <ul>
                        <li>{medicalRecord.prescriptions?.join(', ' || 'None')}</li>
                    </ul>
                </div>
            </div>

            <div className="last-updated">
                <p>
                    <strong>Last check-in: </strong>
                    {medicalRecord.createdAt
                        ? new Date(medicalRecord.createdAt).toLocaleDateString()
                        : 'Unknown'}
                </p>
            </div>
        </div>
            <div className={'med-files'}>
                <h2> Medical Prescriptions</h2>
                <div className={"link1"}>
                    <img src={file} alt="file icon"/>
                    <p>Prescription for antibiotics</p>
                    <a href={'https://www.metlifepetinsurance.com/blog/pet-health/antibiotics-for-dogs/#:~:text=Antibiotics%20typically%20require%20a%20prescription,treat%20your%20pet%27s%20bacterial%20infection.'}> <img src={download} className={'download'} alt="download icon"/></a>

                </div>
                <div className={'link2'}>
                    <img src={file} alt="file icon"/>
                    <p>Prescription for glaucoma drops</p>
                    <a href={'https://www.vetrxdirect.com/product/view/dorzolamide-eye-drops-for-dogs-and-cats-rx#:~:text=Dorzolamide%20Eye%20Drops%20are%20a%20prescription%20ophthalmic,and%20prevents%20glaucoma%20in%20dogs%20and%20cats.'}> <img src={download} className={'download2'} alt="download icon"/> </a>

                </div>
            </div>
        </div>
    );
};

export default MedicalRecordPage;