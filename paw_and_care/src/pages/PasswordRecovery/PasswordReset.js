import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./PasswordRecovery.css";

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Token retrieved from the query parameter
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // For error-specific messages
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch(
          "https://vet-clinic-backend.ew.r.appspot.com/api/auth/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              newPassword, // Only one password input is required
            }),
          }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/password-reset-success");
      }, 3000);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div>
        <div className="password-reset-container">
          <form onSubmit={handleSubmit} className="password-reset-form">
            <h1>Reset Your Password</h1>
            <label htmlFor="new-password">Please enter your new password below.</label>
            <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="8"
                placeholder="Enter your new password"
                className="password-reset-input"
            />

            <button
                type="submit"
                className="submit-button"
                disabled={isLoading || !newPassword}
            >
              {isLoading ? "Resetting..." : "Save New Password"}
            </button>

            {message && (
                <p className={`message ${isError ? "error" : "success"}`}>
                  {message}
                </p>
            )}
          </form>
        </div>
      </div>
  );
};

export default PasswordReset;