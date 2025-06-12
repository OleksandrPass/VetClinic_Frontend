import React from 'react';
import SideMenu from '../components/sideMenu/sideMenu';
import { Outlet } from 'react-router-dom';
import './Layout.css'

const ProfileLayout = () => (
  <div className="profile-layout">
    <SideMenu />
    <Outlet />
  </div>
);

export default ProfileLayout;
