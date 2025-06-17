import React from 'react';
import SideMenu from '../components/sideMenu/sideMenu';
import { Outlet } from 'react-router-dom';
import './Layout.css'

const ProfileLayout = () => (
  <>
    <h1 className={'profile-h1'}>Profile</h1>
    <div className="profile-layout">
      <SideMenu />
      <Outlet />
    </div>
  </>
);

export default ProfileLayout;
