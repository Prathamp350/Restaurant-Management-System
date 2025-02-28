import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <h2>{role === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'}</h2>
      <ul>
        <li><Link to="/employee-dashboard/home">Home</Link></li>
        <li><Link to="/employee-dashboard/reservation">Make Reservation</Link></li>
        <li><Link to="/employee-dashboard/check-reservations">Check Reservation</Link></li>
        <li><Link to="/employee-dashboard/order">Orders</Link></li>
        <li><Link to="/employee-dashboard/menu">Menu</Link></li>
        {/* Add employee-specific links here */}
      </ul>
    </div>
  );
};

export default Sidebar;
