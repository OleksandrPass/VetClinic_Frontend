import React, { useState } from "react";
import "./PasswordRecovery.css";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // To handle error messages
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch(
          "https://vet-clinic-backend.ew.r.appspot.com/api/auth/reset-password-request",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            errorData?.message || "Failed to send password reset request."
        );
      }

      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div>
        <div className="password-recovery-container">
          <form onSubmit={handleSubmit} className="password-recovery-form">
            <h1>Forgot Your Password?</h1>
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="password-recovery-input"
            />
            <p>
              Enter your email below, and we will send you a link to reset your
              password.
            </p>
            <button
                type="submit"
                className="submit-button"
                disabled={isLoading || !email}
            >
              {isLoading ? "Sending..." : "Send Recovery Link"}
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

export default PasswordResetRequest;