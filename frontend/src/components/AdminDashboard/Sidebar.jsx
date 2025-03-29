import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li><Link to="/admin/home">Home</Link></li>
        <li><Link to="/admin/users">Manage Employees</Link></li>
        <li><Link to="/admin/reservation">Make Reservation</Link></li>
        <li><Link to="/admin/check-reservations">Check Reservations</Link></li>
        <li><Link to="/admin/order">Orders</Link></li>
        <li><Link to="/admin/menu">Menu</Link></li>
        <li><Link to="/admin/update-menu">Update Menu</Link></li>
        <li><Link to="/admin/completed-reservations">Reservation History</Link></li>
        <li><Link to="/admin/sales-report">Sales Report</Link></li>

      </ul>
    </div>
  );
};

export default Sidebar;
