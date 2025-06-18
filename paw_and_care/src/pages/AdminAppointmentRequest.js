import React, { useState, useEffect } from 'react';
import './AdminAppointmentRequest.css';
import AppointmentCalendar from "../components/AppointmentCalendar";
import CustomSelect from '../components/CustomSelect';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const AdminAppointmentRequest = () => {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [petName, setPetName] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedTime, setSelectedTime] = useState(null);
    const [reason, setReason] = useState('');
    const [specialist, setSpecialist] = useState('');

    const [petIdentificationError, setPetIdentificationError] = useState('');
    const [bookedSlots, setBookedSlots] = useState({});

    useEffect(() => {
        try {
            const storedBookedSlots = localStorage.getItem('bookedSlots');
            if (storedBookedSlots) {
                setBookedSlots(JSON.parse(storedBookedSlots));
            }
        } catch (e) {
            console.error("Failed to parse booked slots from localStorage:", e);
        }
    }, []);

    const serviceOptions = [
        { value: '', label: 'Select Reason' },
        { value: 'general_checkups', label: 'General Check-ups', id: '4bfce486-6dfa-4208-9c07-2cda20baaed9' },
        { value: 'vaccinations', label: 'Vaccinations', id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        { value: 'dental_care', label: 'Dental Care', id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a' },
        { value: 'grooming', label: 'Grooming', id: 'd9c5e6a7-8b7c-4def-8b7c-d9c5e6a78b7c' },
        { value: 'laboratory_tests', label: 'Laboratory Tests', id: 'e8d7c6b5-a9f8-4cde-a9f8-e8d7c6b5a9f8' },
        { value: 'nutritional_counseling', label: 'Nutritional Counseling', id: 'f7e6d5c4-b3a2-4cde-b3a2-f7e6d5c4b3a2' },
    ];

    const specialistOptions = [
        { value: '', label: 'Select Specialist' },
        { value: 'brooks', label: 'Dr. Olivia Brooks', id: 'ac87a42e-47f7-46c5-bf51-2d1992694d06' },
        { value: 'harrison', label: 'Dr. David Harrison', id: 'add09c39-ead2-4fa3-9835-d4b1a8a70370' },
        { value: 'reynolds', label: 'Dr. Michael Reynolds', id: 'cbffd235-9fa8-494f-8440-46a816317643' },
    ];

    const addBookedSlot = (dateString, timeString) => {
        setBookedSlots(prevSlots => {
            const newSlots = { ...prevSlots };
            if (!newSlots[dateString]) {
                newSlots[dateString] = [];
            }
            if (!newSlots[dateString].includes(timeString)) {
                newSlots[dateString].push(timeString);
            }
            localStorage.setItem('bookedSlots', JSON.stringify(newSlots));
            return newSlots;
        });
    };

    const bookedSlotsForSelectedDate = selectedDate ?
        bookedSlots[selectedDate.format("YYYY-MM-DD")] || [] : [];

    const getAuthToken = () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('user-info'));
            console.log("DEBUG: User Info from localStorage:", userInfo);
            return userInfo?.token || null;
        } catch (e) {
            console.error("Error parsing user-info from localStorage:", e);
            return null;
        }
    };

    const getServiceId = (serviceValue) => {
        const service = serviceOptions.find(opt => opt.value === serviceValue);
        return service ? service.id : null;
    };

    const getSpecialistId = (specialistValue) => {
        const specialist = specialistOptions.find(opt => opt.value === specialistValue);
        return specialist ? specialist.id : null;
    };

    const handleRequest = async (e) => {
        e.preventDefault();
        setPetIdentificationError('');

        console.log("DEBUG: Starting handleRequest. Current form states:");
        console.log({ fullName, email, phone, petName, species, breed, selectedDate: selectedDate?.format('YYYY-MM-DD'), selectedTime, reason, specialist });

        if (
            fullName.trim() === '' ||
            email.trim() === '' ||
            phone.trim() === '' ||
            petName.trim() === '' ||
            species.trim() === '' ||
            reason === '' ||
            specialist === '' ||
            !selectedDate ||
            !selectedTime
        ) {
            alert("Please fill in all required fields and select a date & time.");
            console.error("DEBUG: Validation Failed - Required fields missing or empty.");
            return;
        }
        console.log("DEBUG: Basic fields validation passed.");


        const serviceId = getServiceId(reason);
        const specialistId = getSpecialistId(specialist);

        if (!serviceId) {
            alert("Please select a valid service.");
            console.error("DEBUG: Validation Failed - Invalid service selected. Reason:", reason);
            return;
        }
        if (!specialistId) {
            alert("Please select a valid specialist.");
            console.error("DEBUG: Validation Failed - Invalid specialist selected. Specialist:", specialist);
            return;
        }
        console.log("DEBUG: Service and Specialist IDs retrieved:", { serviceId, specialistId });

        const formattedDate = selectedDate.format("YYYY-MM-DD");
        const formattedTime = selectedTime + ":00";
        const token = getAuthToken();

        if (!token) {
            alert("You must be logged in to request an appointment.");
            console.error("DEBUG: Authorization token is missing. Cannot proceed.");
            return;
        }
        console.log("DEBUG: Token successfully retrieved. Token length:", token.length);

        let targetPetId = null;
        let petsForOwner = [];

        console.log("DEBUG: Attempting to fetch pets by email:", email.trim());
        try {
            const petsResponse = await fetch('https://vet-clinic-backend.ew.r.appspot.com/api/receptionist/pets/by-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const responseDataFromPets = await petsResponse.json().catch((err) => {
                console.error("DEBUG: Error parsing JSON from pets by email response:", err, "Response Status:", petsResponse.status);
                return { message: petsResponse.statusText || 'Unknown error during JSON parsing.' };
            });

            if (!petsResponse.ok) {
                console.error("DEBUG: Failed to fetch pets for owner. Status:", petsResponse.status, "Message:", responseDataFromPets.message);
                setPetIdentificationError(`Failed to find owner or pets for this email: ${responseDataFromPets.message || petsResponse.statusText}. Please verify the owner's email.`);
                return;
            }

            petsForOwner = responseDataFromPets.pets;
            console.log("DEBUG: Pets found for owner:", petsForOwner);

            if (!Array.isArray(petsForOwner) || petsForOwner.length === 0) {
                setPetIdentificationError('No pets found for this user with the provided email. Please ensure the pet is registered and the email is correct.');
                console.warn("DEBUG: No pets array found or array is empty for the provided email.");
                return;
            }

        } catch (petsFetchError) {
            console.error("DEBUG: Network or unexpected error while fetching pets by email:", petsFetchError);
            setPetIdentificationError('A network error occurred while searching for pets. Please try again.');
            return;
        }

        const normalizedPetName = petName.trim().toLowerCase();
        const normalizedSpecies = species.trim().toLowerCase();
        const normalizedBreed = breed.trim().toLowerCase();

        console.log("DEBUG: Pets received from server for owner:", petsForOwner);
        console.log("DEBUG: Normalized form input for pet:", {
            name: normalizedPetName,
            species: normalizedSpecies,
            breed: normalizedBreed
        });

        const foundPet = petsForOwner.find(pet => {
            const petNameFromServer = pet.name ? pet.name.trim().toLowerCase() : '';
            const petSpeciesFromServer = pet.species ? pet.species.trim().toLowerCase() : '';
            const petBreedFromServer = pet.breed ? pet.breed.trim().toLowerCase() : '';


            const nameMatches = petNameFromServer === normalizedPetName;

            console.log(`DEBUG: Checking pet (ID: ${pet.id || 'N/A'}, Server Name: '${pet.name}', Server Species: '${pet.species}', Server Breed: '${pet.breed}'):`);
            console.log(`  - Form Name ('${normalizedPetName}') vs Server Trimmed Lowercase Name ('${petNameFromServer}'): ${nameMatches}`);

            console.log(`  - Overall match: ${nameMatches}`);


            return nameMatches;
        });

        if (!foundPet) {
            setPetIdentificationError('Pet not found with the provided name for this owner. Please check pet details. (Only pet name is used for identification)');
            console.warn("DEBUG: Pet not found in the list fetched for the owner based on provided name.");
            return;
        }
        targetPetId = foundPet.id;
        console.log("DEBUG: Pet found! Target Pet ID:", targetPetId);

        const requestBody = {
            service_id: serviceId,
            specialist_id: specialistId,
            date: formattedDate,
            time: formattedTime,
        };
        const apiUrl = `https://vet-clinic-backend.ew.r.appspot.com/api/receptionist/pets/${targetPetId}/appointments`;

        console.log("DEBUG: Sending appointment request to:", apiUrl, "with body:", requestBody);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json().catch((err) => {
                console.error("DEBUG: Error parsing JSON from appointment request response:", err, "Response Status:", response.status);
                return { message: response.statusText || 'No additional error info from server.' };
            });

            if (response.ok) {
                addBookedSlot(formattedDate, selectedTime);
                console.log("DEBUG: Appointment successfully created. Response:", responseData);
                // Очистка формы
                setFullName('');
                setEmail('');
                setPhone('');
                setPetName('');
                setSpecies('');
                setBreed('');
                setSelectedDate(dayjs());
                setSelectedTime(null);
                setReason('');
                setSpecialist('');

                navigate('/request-success');
            } else {
                alert(`Appointment request failed: ${responseData.message || response.statusText}`);
                console.error('DEBUG: Appointment request error response:', responseData);
            }
        } catch (error) {
            console.error("DEBUG: Network or server error during appointment request:", error);
            alert('A network error occurred while requesting your appointment. Please try again later.');
        }
    };

    return (
        <div className="admin-appointment-page-container">
            <h3 className="admin-page-title">New Appointment (Admin/Receptionist)</h3>
            <div className="admin-form-calendar-layout">
                <div className="admin-form-section">
                    <div className="form-wrapper">
                        <form className="appointment-form" onSubmit={handleRequest}>

                            <div className="appointment-form-group single">
                                <label>Owner's Full Name*</label>
                                <input type="text"
                                       value={fullName}
                                       onChange={(e) => setFullName(e.target.value)}
                                       required />
                            </div>

                            <div className="appointment-form-row">
                                <div className="appointment-form-group">
                                    <label>Owner's Email*</label>
                                    <input type="email"
                                           value={email}
                                           onChange={(e) => setEmail(e.target.value)}
                                           required />
                                </div>
                                <div className="appointment-form-group">
                                    <label>Owner's Phone Number*</label>
                                    <input type="tel"
                                           value={phone}
                                           onChange={(e) => setPhone(e.target.value)}
                                           required
                                    />
                                </div>
                            </div>

                            <div className="appointment-form-group single">
                                <label>Pet's Name*</label>
                                <input type="text"
                                       value={petName}
                                       onChange={(e) => setPetName(e.target.value)}
                                       required />
                                {petIdentificationError && <p className="error-message">{petIdentificationError}</p>}
                            </div>

                            <div className="appointment-form-row">
                                <div className="appointment-form-group">
                                    <label>Species*</label>
                                    <input type="text"
                                           value={species}
                                           onChange={(e) => setSpecies(e.target.value)}
                                           required />
                                </div>
                                <div className="appointment-form-group">
                                    <label>Breed</label>
                                    <input type="text"
                                           value={breed}
                                           onChange={(e) => setBreed(e.target.value)}
                                           required={false}
                                    />
                                </div>
                            </div>

                            <div className="appointment-form-group single">
                                <label>Reason for Appointment*</label>
                                <CustomSelect
                                    label="Reason for Appointment"
                                    options={serviceOptions}
                                    required={true}
                                    value={reason}
                                    onChange={setReason}
                                />
                            </div>

                            <div className="appointment-form-group single">
                                <label>Choose a Specialist*</label>
                                <CustomSelect
                                    label="Choose a Specialist"
                                    options={specialistOptions}
                                    required={true}
                                    value={specialist}
                                    onChange={setSpecialist}
                                />
                            </div>

                            <div className="request-wrapper">
                                <button type="submit" className="request-btn" onClick={handleRequest}>Request</button>
                            </div>

                            <p className="required-note">* Indicates a required field</p>
                        </form>
                    </div>
                </div>

                <div className="admin-calendar-section">
                    <AppointmentCalendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                        bookedSlotsForSelectedDate={bookedSlotsForSelectedDate}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminAppointmentRequest;