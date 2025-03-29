import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/checkreservation.css";

const CheckReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reservations");
        setReservations(response.data);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("Failed to fetch reservations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/reservations/${id}`, { status });
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation._id === id ? { ...reservation, status: response.data.status } : reservation
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update reservation status. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading reservations...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const deleteReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reservations/${id}`);
      setReservations((prev) => prev.filter((res) => res._id !== id)); // Remove from frontend state
      alert("Reservation deleted successfully!");
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Failed to delete reservation. Please try again.");
    }
  };
  

  const activeReservations = reservations.filter(res => res.status === "Pending");
  

  return (
    <div className="check-reservation-page">
      <h1>Pending Reservations</h1>
      {activeReservations.length === 0 ? (
        <p>No pending reservations found.</p>
      ) : (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Date</th>
              <th>Time</th>
              <th>Guests</th>
              <th>Special Request</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeReservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.name}</td>
                <td>{reservation.mobile}</td>
                <td>{new Date(reservation.date).toLocaleDateString()}</td>
                <td>{reservation.time}</td>
                <td>{reservation.guests}</td>
                <td>{reservation.specialRequest || "N/A"}</td>
                <td>{reservation.status}</td>
                <td>
                  <button
                    onClick={() => updateStatus(reservation._id, "Completed")}
                    disabled={reservation.status === "Completed"}
                    className="action-btn complete"
                  >
                    Complete
                  </button>
                  <button 
                  onClick={() => deleteReservation(reservation._id)}
                  className="action-btn delete">Delete</button>


                  <button
                    onClick={() => alert("Update functionality coming soon!")}
                    className="action-btn update"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CheckReservation;
