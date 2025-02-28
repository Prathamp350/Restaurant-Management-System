import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MainContent.css';
import { Link } from 'react-router-dom';

const MainContent = () => {
  const [user, setUser] = useState({ username: '' });
  const [stats, setStats] = useState({
    activeUsers: 0,
    pendingReservations: 0,
    reportsGenerated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats({
        activeUsers: response.data.activeUsers,
        pendingReservations: response.data.pendingReservations,
        reportsGenerated: response.data.reportsGenerated,
      });
    } catch (err) {
      setError('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assume the token is stored in localStorage
        const response = await axios.get('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data); // Set the user data (username)
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData(); // Fetch the user data
    fetchStats(); // Fetch the stats
  }, []);

  // Optional: Add a function to trigger the stats refresh in child components.
  const refreshStats = () => {
    fetchStats(); // Refresh stats when invoked (from other components).
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="main-content">
      {/* Stats and Quick Actions */}
      <div className="top-section">
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Active Employees</h3>
            <p>{stats.activeUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Reservations</h3>
            <p>{stats.pendingReservations}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Orders</h3>
            <p>{stats.reportsGenerated}</p>
          </div>
        </div>
        <div className="dashboard-links">
          <h3>Quick Actions</h3>
          <div className="link-container">
            <Link to="/admin/users" className="link-card">
              <h4>Manage Employees</h4>
            </Link>
            <Link to="/admin/check-reservations" className="link-card">
              <h4>Manage Reservations</h4>
            </Link>
            <Link to="/admin/order" className="link-card">
              <h4>View Orders</h4>
            </Link>
            <Link to="/admin/menu" className="link-card">
              <h4>Menu</h4>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
