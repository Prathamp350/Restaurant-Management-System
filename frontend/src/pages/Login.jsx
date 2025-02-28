import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Error state for displaying messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to the backend for authentication
      const response = await axios.post('http://localhost:5000/login', { username, password });

      if (response.data.success) {
        // Check the user role and navigate accordingly
        const { role, token } = response.data;
        localStorage.setItem('token', token);  // Store token for future requests

        if (role === 'admin') {
          navigate('/admin/home'); // Navigate to admin dashboard
        } else if (role === 'employee') {
          navigate('/employee-dashboard/home'); // Navigate to employee dashboard
        }
      } else {
        setError('Invalid username or password'); // Handle error if login fails
      }
    } catch (error) {
      setError('Error occurred during login');
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>LOGIN</h1>
          {error && <div className="error-message">{error}</div>}
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Log in</button>
        </form>
      </div>
    </div>
  );  
};

export default Login;
