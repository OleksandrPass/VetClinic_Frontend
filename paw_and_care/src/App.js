import React, { Profiler } from "react";
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
import Header from "./components/header/header";
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

function App() {
  return (
    <Router>
      <div>
        <HeaderRouter/>
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
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/sign-up" element={<SignUp/>} />
          <Route path="/password-reset-request" element={<PasswordRecoveryRequest />} />
          <Route path="/auth/reset-password/:token" element={<PasswordReset />} />
          <Route path="/password-reset-success" element={<PasswordRecoverySuccess />} />
          <Route path="/remove-account" element={<AccountDeletion />} />
          <Route path="/remove-account-success" element={<PageDeletionSuccess />} />
          <Route path="/appointment-request" element={<RequestAppointment />} />
          <Route path="/request-success" element={<PageRequestSuccess />} />
          <Route path="/write-a-review" element={<WriteReview />} />
          <Route path="/review-submitted" element={<PageReviewSubmitted />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment-request" element={<RequestAppointment />} />
          <Route path="/request-success" element={<PageRequestSuccess />} />
          <Route path="/write-a-review" element={<WriteReview />} />
          <Route path="/review-submitted" element={<PageReviewSubmitted />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<ProfileLayout />}>
            <Route path="pets" element={<PetPage />} />
            <Route path="pets/:petId" element={<PetDetailsPage />} />
            <Route path="pets/:petId/medical-record" element={<MedicalRecordPage />} />
          </Route>
          <Route path="/schedule" element={<Schedule />} />

        </Routes>
        <Footer/>>
      </div>
    </Router>
  );
}

export default App;
