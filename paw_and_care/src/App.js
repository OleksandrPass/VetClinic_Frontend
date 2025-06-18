import React, { Profiler } from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main/Main';
import Services from './pages/Services/Services';
import AboutUs from "./pages/AboutUs/AboutUs";
import GeneralCheckUps from "./pages/Services/GeneralCheckUps";
import Vaccinations from "./pages/Services/Vaccinations";
import DentalCare from "./pages/Services/DentalCare";
import Grooming from "./pages/Services/Grooming";
import LaboratoryTests from "./pages/Services/LaboratoryTests";
import NutritionalCounselling from "./pages/Services/NutritionalCounselling";
import LogIn from "./pages/Login/LogIn";
import SignUp from "./pages/SignUp/SignUp";
import PasswordReset from "./pages/PasswordRecovery/PasswordReset";
import PasswordRecoveryRequest from "./pages/PasswordRecovery/PasswordRecoveryRequest";
import PasswordRecoverySuccess from "./pages/PasswordRecovery/PasswordRecoverySuccess";
import AccountDeletion from "./pages/AccountDeletion/AccountDeletion";
import PageDeletionSuccess from "./pages/AccountDeletion/PageDeletionSuccess";
import PetPage from "./pages/Profile/profilePages/PetPage";
import ProfileLayout from "./Layouts/ProfileLayout";
import Footer from "./components/footer/footer";
import PetDetailsPage from "./pages/Profile/profilePages/PetDetailsPage";
import MedicalRecordPage from "./pages/Profile/profilePages/MedicalRecordPage";
import RequestAppointment from "./pages/RequestAppointment";
import PageRequestSuccess from "./pages/PageRequestSuccess";
import WriteReview from "./pages/WriteReview";
import PageReviewSubmitted from "./pages/PageReviewSubmitted";
import Contact from "./pages/Contact";
import Schedule from "./pages/Schedule";
import HeaderRouter from "./components/header/headerRouter";
import VisitsPage from "./pages/Profile/profilePages/VisitsPage";
import AdminAppointmentRequest from "./pages/AdminAppointmentRequest";
import {AuthProvider} from "./api/AuthContext";
import Patients from "./pages/Patients";
import ScheduleAdmin from "./pages/ScheduleAdmin";
import PetCardAdmin from "./components/PetCard/PetCardAdmin";
import PetDetailsPageAdmin from "./pages/Profile/profilePages/PetDetailsPageAdmin";
import MedicalRecordPageDoctor from "./pages/Profile/profilePages/MedicalRecordPageDoctor";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user-info'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('user-info'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  return (
      <Router>
        <div>
          <HeaderRouter setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/general-checkups" element={<GeneralCheckUps />} />
          <Route path="/vaccinations" element={<Vaccinations />} />
          <Route path="/dental-care" element={<DentalCare />} />
          <Route path="/grooming" element={<Grooming />} />
          <Route path="/lab-tests" element={<LaboratoryTests />} />
          <Route path="/nutrition" element={<NutritionalCounselling />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/log-in" element={<LogIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login" element={<LogIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/sign-up" element={<SignUp/>} />
          <Route path="/password-reset-request" element={<PasswordRecoveryRequest />} />
          <Route path="/auth/reset-password" element={<PasswordReset />} />
          <Route path="/password-reset-success" element={<PasswordRecoverySuccess />} />
          <Route path="/remove-account" element={<AccountDeletion />} />
          <Route path="/remove-account-success" element={<PageDeletionSuccess />} />
          <Route path="/appointment-request" element={<RequestAppointment />} />
          <Route path="/request-success" element={<PageRequestSuccess />} />
          <Route path="/write-a-review" element={<WriteReview />} />
          <Route path="/review-submitted" element={<PageReviewSubmitted />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/request-appointment" element={<RequestAppointment />} />
          <Route path="/admin/request-appointment" element={<AdminAppointmentRequest />} />
          <Route path="/request-success" element={<PageRequestSuccess />} />
          <Route path="/write-a-review" element={<WriteReview />} />
          <Route path="/review-submitted" element={<PageReviewSubmitted />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<ProfileLayout />}>
            <Route path="pets" element={<PetPage />} />
            <Route path="pets/:petId" element={<PetDetailsPage />} />
            <Route path="pets/:petId/medical-record" element={<MedicalRecordPage />} />
            <Route path="visits" element={<VisitsPage />} />
          </Route>
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/schedule_admin" element={<ScheduleAdmin />} />
          <Route path={"/patients/pets/:petId"} element={<PetDetailsPageAdmin />} />
          <Route path={"/patients/pets/:petId/medical-record"} element={<MedicalRecordPageDoctor />} />

        </Routes>
        <Footer/>>
      </div>
    </Router>
  );
}

export default App;
