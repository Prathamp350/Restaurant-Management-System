import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import { FaBell } from "react-icons/fa"; // Import notification icon

const Navbar = () => {
  const [user, setUser] = useState({ username: "" });
  const [pendingOrders, setPendingOrders] = useState([]);
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
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      
      const pendingOrders = response.data.filter(
        (order) => order.status === "pending"
      );

      setPendingOrders(pendingOrders);
    } catch (err) {
      console.error("Error fetching pending orders:", err);
    }
  };

  return (
    <div className="navbar">
      <h3>Welcome, {user.username || "Admin"}</h3>

      <div className="navbar-actions">
        <div className="notification-icon" onClick={() => setShowDropdown(!showDropdown)}>
          <FaBell size={24} />
          {pendingOrders.length > 0 && <span className="notification-badge">{pendingOrders.length}</span>}
        </div>

        {showDropdown && (
          <div className="notification-dropdown">
            <h4>Pending Orders ({pendingOrders.length})</h4>
            {pendingOrders.length > 0 ? (
              <ul>
                {pendingOrders.map((order) => (
                  <li key={order._id}>
                    <strong>Order #{order._id}</strong> - {order.items.length} items
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending orders.</p>
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
