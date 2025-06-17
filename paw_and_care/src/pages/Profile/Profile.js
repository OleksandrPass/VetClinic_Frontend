import React from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import SideMenu from "../../components/sideMenu/sideMenu";
import './Profile.css'
import dog from '../../assets/Pet profile/Labrador.jpg';


const Profile = () => {
  return (
    <div className={'pet-page'}>
      <div className={'main-section'}>
        <div className={'grid-container'}>
          <SideMenu/>
          <div className={'pet-card'}>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;