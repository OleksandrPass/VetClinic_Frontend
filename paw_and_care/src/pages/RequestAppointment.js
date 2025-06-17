import React, { useState, useEffect } from 'react';
import './RequestAppointment.css';
import AppointmentCalendar from "../components/AppointmentCalendar";
import CustomSelect from '../components/CustomSelect';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';


const RequestAppointment = () => {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [agree, setAgree] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState('');
  const [specialist, setSpecialist] = useState('');

  const [userPets, setUserPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [petIdError, setPetIdError] = useState('');

  const [bookedSlots, setBookedSlots] = useState({});

  useEffect(() => {
    try {
      const storedBookedSlots = localStorage.getItem('bookedSlots');
      if (storedBookedSlots) {
        setBookedSlots(JSON.parse(storedBookedSlots));
      }
    } catch (e) {
      console.error("Failed to parse booked slots from localStorage", e);
    }
  }, []);

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

  const serviceOptions = [
    { value: '', label: '' },
    { value: 'general_checkups', label: 'General Check-ups', id: '4bfce486-6dfa-4208-9c07-2cda20baaed9' },
    { value: 'vaccinations', label: 'Vaccinations', id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
    { value: 'dental_care', label: 'Dental Care', id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a' },
    { value: 'grooming', label: 'Grooming', id: 'd9c5e6a7-8b7c-4def-8b7c-d9c5e6a78b7c' },
    { value: 'laboratory_tests', label: 'Laboratory Tests', id: 'e8d7c6b5-a9f8-4cde-a9f8-e8d7c6b5a9f8' },
    { value: 'nutritional_counseling', label: 'Nutritional Counseling', id: 'f7e6d5c4-b3a2-4cde-b3a2-f7e6d5c4b3a2' },
  ];

  const specialistOptions = [
    { value: '', label: '' },
    { value: 'brooks', label: 'Dr. Olivia Brooks', id: 'ac87a42e-47f7-46c5-bf51-2d1992694d06' },
    { value: 'harrison', label: 'Dr. David Harrison', id: 'add09c39-ead2-4fa3-9835-d4b1a8a70370' },
    { value: 'reynolds', label: 'Dr. Michael Reynolds', id: 'cbffd235-9fa8-494f-8440-46a816317643' },
  ];

  const getAuthToken = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user-info'));
      return userInfo?.token || null; // Проверяем наличие 'token'
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

  useEffect(() => {
    const fetchUserPets = async () => {
      setLoadingPets(true);
      try {
        const token = getAuthToken();
        if (!token) {
          console.warn("Authorization token not found. User pets cannot be fetched. Are you sure that you entered your profile?");
          alert("You are not logged in. Please log in to view your pets.");
          setLoadingPets(false);
          return;
        }

        const response = await fetch('https://vet-clinic-backend.ew.r.appspot.com/api/user/pets', {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          if (errorData.message && errorData.message.includes('Token expired')) {
            console.error("Error fetching user pets: Token expired. Please log in again.");
            alert("Your session has expired. Please log in again.");
            setLoadingPets(false);
            return;
          }
          console.error(`Error fetching user pets: ${errorData.message}`);
          alert(`Error fetching your pets: ${errorData.message}. Please try refreshing the page.`);
          setLoadingPets(false);
          return;
        }


        const data = await response.json();
        setUserPets(data);
        console.log("Fetched user pets:", data);
      } catch (error) {
        console.error("Network or unexpected error fetching user pets:", error.message);
        alert(`An unexpected error occurred while fetching your pets: ${error.message}. Please try again.`);
      } finally {
        setLoadingPets(false);
      }
    };

    fetchUserPets();
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    setPetIdError('');

    if (
      fullName.trim() === '' ||
      email.trim() === '' ||
      phone.trim() === '' ||
      petName.trim() === '' ||
      species.trim() === '' ||
      breed.trim() === '' ||
      reason === '' ||
      specialist === '' ||
      !selectedDate ||
      !selectedTime ||
      !agree
    ) {
      alert("Please fill in all required fields and select a date & time.");
      return;
    }

    const serviceId = getServiceId(reason);
    const specialistId = getSpecialistId(specialist);

    if (!serviceId) {
      alert("Please select a valid service.");
      return;
    }
    if (!specialistId) {
      alert("Please select a valid specialist.");
      return;
    }

    const normalizedPetName = petName.trim().toLowerCase();
    const normalizedSpecies = species.trim().toLowerCase();
    const normalizedBreed = breed.trim().toLowerCase();

    const foundPet = userPets.find(pet =>
      pet.name.toLowerCase() === normalizedPetName &&
      (pet.species ? pet.species.toLowerCase() === normalizedSpecies : true) &&
      (pet.breed ? pet.breed.toLowerCase() === normalizedBreed : true)
    );

    if (!foundPet) {
      setPetIdError('Pet with this name, species, or breed not found for this user. Please ensure the pet information is correct or register the pet first.');
      return;
    }

    const petId = foundPet.id;

    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const formattedTime = selectedTime + ":00";

    const requestData = {
      fullName,
      email,
      phoneNumber: phone,
      petId,
      species,
      breed,
      serviceId,
      specialistId,
      date: formattedDate,
      time: formattedTime,
    };

    try {
      const token = getAuthToken();
      if (!token) {
        alert("You must be logged in to request an appointment.");
        return;
      }

      const response = await fetch('https://vet-clinic-backend.ew.r.appspot.com/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json().catch(() => ({ message: 'No additional error info from server.' }));

      if (response.ok) {
        addBookedSlot(formattedDate, selectedTime);
        setFullName('');
        setEmail('');
        setPhone('');
        setPetName('');
        setSpecies('');
        setBreed('');
        setAgree(false);
        setSelectedDate(dayjs());
        setSelectedTime(null);
        setReason('');
        setSpecialist('');

        navigate('/request-success');
      } else {
        alert(`Appointment request failed: ${responseData.message || response.statusText}`);
        console.error('Appointment request error:', responseData);
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert('A network error occurred while requesting your appointment. Please try again later.');
    }
  };

  if (loadingPets) {
    return (
      <div>
        <h3>Request Appointment</h3>
        <div className="request-appointment">
          <p>Loading pet information...</p>
        </div>

      </div>
    );
  }


  return (
    <div>
      <h3>Request Appointment</h3>
      <div className="request-appointment">
        <div className="form-section">
          <div className="form-wrapper">
            <form className="appointment-form" onSubmit={handleRequest}>
              <div className="appointment-form-group single">
                <label>Full Name*</label>
                <input type="text"
                       value={fullName}
                       onChange={(e) => setFullName(e.target.value)}
                       required />
              </div>

              <div className="appointment-form-row">
                <div className="appointment-form-group">
                  <label>Email*</label>
                  <input type="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         required />
                </div>
                <div className="appointment-form-group">
                  <label>Phone Number*</label>
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
                {petIdError && <p className="error-message">{petIdError}</p>}
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
                  <label>Breed*</label>
                  <input type="text"
                         value={breed}
                         onChange={(e) => setBreed(e.target.value)}
                         required />
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
            </form>
          </div>

          <div className="checkbox-wrapper">
            <label className="appointment-form-checkbox">
              <input type="checkbox"
                     checked={agree}
                     onChange={(e) => setAgree(e.target.checked)}
                     required />
              <span className="appointment-checkbox-text">
                                By registering, I acknowledge that I have read and agree to the
                                <a href="#"> Terms of Service</a> and <a href="#">Privacy Policy</a>.
                            </span>
            </label>
          </div>

          <div className="request-wrapper">
            <button type="submit" className="request-btn" onClick={handleRequest}>Request</button>
          </div>

          <p className="required-note">* Indicates a required field</p>
        </div>

        <div className="calendar-section">
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

export default RequestAppointment;