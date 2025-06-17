import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import './AccountDeletion.css'
import React from "react";
import { Link } from "react-router-dom";

const AccountDeletion = () => {



  return (
    <div>

      <div className={"deletion-container"}>
        <div className={"deletion"}>
          <h1>:(</h1>
          <p>Are you sure you want to delete your account?</p>
        </div>
        <Link to={"/remove-account-success"}></Link>
        <button type={'submit'}>Delete Account</button>
      </div>

    </div>
  )
}

export default AccountDeletion;