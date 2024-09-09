import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import './Login.css'; // Import the CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to login');

      // Handle successful login
      console.log('Login successful:', data.message);
      setSuccessMessage(data.message); // Show success message
      setError(''); // Clear error message if login was successful
      setFormData({
        email: '',
        password: ''
      });

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.message); // Set error message
      setSuccessMessage(''); // Clear success message if there is an error
    }
  };

  return (
    <div className="parent-container">
      <div className="form-container">
        <h2>Login</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
