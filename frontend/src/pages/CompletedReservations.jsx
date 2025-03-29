import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/checkreservation.css";


const CompletedReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reservations");
        const completed = response.data.filter(res => res.status === "Completed");
        setReservations(completed);
        setFilteredReservations(completed);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("Failed to fetch reservations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [month, year]);

  const filterReservations = () => {
    let filtered = reservations;
    if (month) {
      filtered = filtered.filter(res => new Date(res.date).getMonth() + 1 === parseInt(month));
    }
    if (year) {
      filtered = filtered.filter(res => new Date(res.date).getFullYear() === parseInt(year));
    }
    setFilteredReservations(filtered);
  };

  if (loading) {
    return <div>Loading completed reservations...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="completed-reservations-page">
      <h1>Completed Reservations</h1>
      <div className="filters">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          {Array.from({ length: 6 }, (_, i) => (
            <option key={i} value={new Date().getFullYear() - 5 + i}>{new Date().getFullYear() - 5 + i}</option>
          ))}
        </select>
      </div>
      {filteredReservations.length === 0 ? (
        <p>No completed reservations found for the selected filters.</p>
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
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.name}</td>
                <td>{reservation.mobile}</td>
                <td>{new Date(reservation.date).toLocaleDateString()}</td>
                <td>{reservation.time}</td>
                <td>{reservation.guests}</td>
                <td>{reservation.specialRequest || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompletedReservations;
