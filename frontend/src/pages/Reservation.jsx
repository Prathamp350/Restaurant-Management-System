import React, { useState } from "react";
import "../styles/reservation.css";
import axios from 'axios'; // Import axios for HTTP requests

const Reservation = () => {
  const [reservationDetails, setReservationDetails] = useState({
    name: "",
    mobile: "",
    date: "",
    time: "",
    guests: 1,
    specialRequest: "",
  });

  const [mobileError, setMobileError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState(""); // Added state for time error
  const [formError, setFormError] = useState(""); // For general form submission errors
  const [isSubmitting, setIsSubmitting] = useState(false); // To disable button while submitting

  const handleChange = (e) => {
    setReservationDetails({
      ...reservationDetails,
      [e.target.name]: e.target.value,
    });

    // Validate mobile number on every input change
    if (e.target.name === "mobile") {
      const mobile = e.target.value;
      const isValid = validateMobile(mobile);
      if (!isValid) {
        setMobileError("Please enter a valid 10-digit mobile number or +91 followed by 10 digits.");
      } else {
        setMobileError(""); // Clear error if valid
      }
    }

    // Validate date on every change
    if (e.target.name === "date") {
      const currentDate = new Date().toISOString().split("T")[0];
      const selectedDate = e.target.value;
      if (selectedDate < currentDate) {
        setDateError("Please select a future date.");
      } else if (selectedDate > getMaxDate()) {
        setDateError("Reservation cannot be made for more than one month from the current date.");
      } else {
        setDateError(""); // Clear error if valid
      }
    }

    // Validate time on every change
    if (e.target.name === "time") {
      const selectedTime = e.target.value;
      const minTime = "06:00"; // Restaurant opens at 6:00 AM
      const maxTime = "23:30"; // Restaurant closes at 11:30 PM
      if (selectedTime < minTime || selectedTime > maxTime) {
        setTimeError("Please select a time between 06:00 AM and 11:30 PM.");
      } else {
        setTimeError(""); // Clear error if valid
      }
    }
  };

  const validateMobile = (mobile) => {
    const regex = /^(?:\+91)?[0-9]{10}$/;
    return regex.test(mobile);
  };

  const getMaxDate = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    return currentDate.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    const isValidMobile = validateMobile(reservationDetails.mobile);
    if (!isValidMobile) {
      setMobileError("Please enter a valid 10-digit mobile number or +91 followed by 10 digits.");
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];
    if (reservationDetails.date < currentDate) {
      setDateError("Please select a future date.");
      return;
    } else if (reservationDetails.date > getMaxDate()) {
      setDateError("Reservation cannot be made for more than one month from the current date.");
      return;
    }

    setIsSubmitting(true); // Disable submit button while sending data
    setFormError(""); // Clear previous errors

    try {
      // Send reservation details to the backend (API path updated to match the backend)
      const response = await axios.post("http://localhost:5000/api/reservations", reservationDetails);

      if (response.status === 201) {
        alert("Reservation submitted successfully! We'll contact you shortly.");
        setReservationDetails({
          name: "",
          mobile: "",
          date: "",
          time: "",
          guests: 1,
          specialRequest: "",
        });
      }
    } catch (error) {
      setFormError("There was an error submitting your reservation. Please try again.");
      console.error("Error submitting reservation:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  const currentDate = new Date().toISOString().split("T")[0];
  const maxDate = getMaxDate();

  return (
    <div className="reservation-page">
      <div className="reservation-hero-section">
        <h1>Reservation</h1>
      </div>

      <div className="reservation-form-container">
        <form className="reservation-form" onSubmit={handleSubmit}>
          {/* Form inputs (same as before) */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={reservationDetails.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile No.</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              placeholder="Enter your mobile number"
              value={reservationDetails.mobile}
              onChange={handleChange}
              pattern="^\+91\d{10}$|^\d{10}$"
              required
            />
            {mobileError && <p className="error-message">{mobileError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Reservation Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={reservationDetails.date}
              onChange={handleChange}
              min={currentDate}
              max={maxDate}
              required
            />
            {dateError && <p className="error-message">{dateError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={reservationDetails.time}
              onChange={handleChange}
              min="06:00"
              max="23:30"
              required
            />
            {timeError && <p className="error-message">{timeError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="guests">Number of Guests</label>
            <input
              type="number"
              id="guests"
              name="guests"
              min="1"
              max="20"
              value={reservationDetails.guests}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialRequest">Special Requests</label>
            <textarea
              id="specialRequest"
              name="specialRequest"
              rows="4"
              placeholder="Any special requests? (optional)"
              value={reservationDetails.specialRequest}
              onChange={handleChange}
            ></textarea>
          </div>

          {formError && <p className="error-message">{formError}</p>}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Reservation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
