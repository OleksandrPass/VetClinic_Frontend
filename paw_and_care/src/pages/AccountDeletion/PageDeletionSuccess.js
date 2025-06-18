﻿import tick from "../../assets/SVG/tick-circle.svg";
import "./success.css";
import { Link } from "react-router-dom";

const PageDeletionSuccess = () => {
  return (
      <div className="content">
        <div className="content-container">
          <img src={tick} alt="tick-circle" />
          <h3>Password reset successful! You can now log in with your new password.</h3>
        </div>
        <div className="buttons-container">
          <Link to={"/log-in"}>
            <button className="log-in">Log In</button>
          </Link>
          <Link to={"/"}>
            <button className="back-home">Back Home</button>
          </Link>
        </div>
      </div>
  );
};

export default PageDeletionSuccess;