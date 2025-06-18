import React from "react";
import "./AccountDeletion.css";
import { Link, useNavigate } from "react-router-dom";

const AccountDeletion = () => {
  const navigate = useNavigate();

  const handleAccountDeletion = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in. Please log in to delete your account.");
      return;
    }

    if (!window.confirm("Are you absolutely sure you want to delete your account permanently?")) {
      return;
    }

    try {
      const response = await fetch(
          "https://vet-clinic-backend.ew.r.appspot.com/api/auth/delete-account",
          {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          }
      );

      if (response.ok) {
        // On success, clear user data and redirect
        localStorage.removeItem("user-info");
        localStorage.removeItem("token");

        alert("Account deleted successfully!");
        navigate("/remove-account-success");
      } else {
        const result = await response.json();
        alert("Failed to delete account: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Something went wrong while deleting your account. Please try again later.");
    }
  };

  return (
      <div>
        <div className="deletion-container">
          <div className="deletion">
            <h1>:(</h1>
            <p>Are you sure you want to delete your account?</p>
          </div>
          <button type="button" onClick={handleAccountDeletion} className="delete-account-btn">
            Delete Account
          </button>
        </div>
      </div>
  );
};

export default AccountDeletion;