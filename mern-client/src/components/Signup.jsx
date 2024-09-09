import React, { useState } from 'react';
import './Signup.css';  // Import the CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(''); // State for error message
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

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
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data.message);
        setSuccessMessage(data.message);  // Show success message
        setError('');  // Clear error message if signup was successful
        setFormData({
          name: '',
          email: '',
          password: ''
        });
      } else {
        console.error('Signup failed:', data.message);
        setError(data.message);  // Show the error message from the server
        setSuccessMessage('');  // Clear success message if there is an error
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setError('An unexpected error occurred');  // Show a generic error message
      setSuccessMessage('');  // Clear success message if there is an error
    }
  };

  return (
    <div className="parent-container">
      <div className="form-container">
        <h2>Signup</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
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
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
