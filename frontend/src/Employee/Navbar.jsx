import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState({ username: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setUser({ username: data.username });
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="navbar">
      <h3>Welcome, {user.username || 'Employee'}</h3>
      <div className="navbar-actions">
        <Link to="/">
          <button>Logout</button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
