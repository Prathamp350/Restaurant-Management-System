import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import { FaBell } from "react-icons/fa"; // Import notification icon

const Navbar = () => {
  const [user, setUser] = useState({ username: "" });
  const [reservations, setReservations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setUser({ username: data.username });
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    };

    fetchUser();
    fetchTodaysReservations();
  }, []);

  const fetchTodaysReservations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reservations");
      const today = new Date().toISOString().split("T")[0];

      const todaysReservations = response.data.filter(
        (reservation) => reservation.date.split("T")[0] === today
      );

      setReservations(todaysReservations);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  };

  return (
    <div className="navbar">
      <h3>Welcome, {user.username || "Admin"}</h3>

      <div className="navbar-actions">
        <div className="notification-icon" onClick={() => setShowDropdown(!showDropdown)}>
          <FaBell size={24} />
          {reservations.length > 0 && <span className="notification-badge">{reservations.length}</span>}
        </div>

        {showDropdown && (
          <div className="notification-dropdown">
            <h4>Today's Reservations ({reservations.length})</h4>
            {reservations.length > 0 ? (
              <ul>
                {reservations.map((res) => (
                  <li key={res._id}>
                    <strong>{res.name}</strong> - {res.time}, {res.guests} guests
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reservations for today.</p>
            )}
          </div>
        )}

        <Link to="/">
          <button>Logout</button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
