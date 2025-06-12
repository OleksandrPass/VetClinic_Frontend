﻿import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import tick from "../../assets/SVG/tick-circle.svg"
import "../PasswordRecovery/PasswordRecovery.css"
import { Link } from "react-router-dom";

const PageDeletionSuccess = () => {

  return (
    <div>

      <div className="content">
        <div className={"content-container"}>
          <img src={tick} alt="tick-circle" />
          <h3> Your account has been successfully deleted.</h3>
        </div>
        <div className={"buttons-container"}>
          <Link to={"/log-in"} ><button className={"log-in"}>Log In</button></Link>
          <Link to={"/"}><button className={"back-home"}>Back Home</button></Link>
        </div>
      </div>
    </div>
  );

};

export default PageDeletionSuccess;