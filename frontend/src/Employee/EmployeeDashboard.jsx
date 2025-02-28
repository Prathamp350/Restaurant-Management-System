import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './employeeDashboard.css';
import MainContent from './MainContent';
import { Outlet } from 'react-router-dom';

const EmployeeDashboard = () => {
  return (
    <div className="employee-dashboard">
      <Sidebar role="employee" />
      <div className="dashboard-content">
        <Navbar />
        <MainContent />
        {/* Use Outlet here for rendering nested routes */}

        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
