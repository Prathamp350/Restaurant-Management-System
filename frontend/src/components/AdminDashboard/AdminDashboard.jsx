import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MainContent from './MainContent';
import './AdminDashboard.css';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        {/* Use Outlet here for rendering nested routes */}
        <MainContent />

        <Outlet />
        {/* MainContent can be placed here if you want it to appear alongside nested routes */}
      </div>
    </div>
  );
};

export default AdminDashboard;
