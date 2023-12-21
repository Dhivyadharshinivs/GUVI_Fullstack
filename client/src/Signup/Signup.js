import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be 8-15 characters, including uppercase, lowercase, numbers, and special characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/signup', formData);

      if (response.status === 200) {
        console.log(response.data);
        setSuccessMessage(response.data.message || 'User registered successfully!');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      } else if (response.status === 400) { // Handle 400 status for user-related errors
        const errorData = response.data || {};
        setError(errorData.message || 'Registration failed. Please check your information and try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }  catch (error) {
      setError(error.response ? error.response.data.message || 'Something went wrong.' : 'Network error. Please check your internet connection.');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit}>

<div className="form-group">
  <label htmlFor="name">Name: </label>
  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required/>
</div>

<div className="form-group">
  <label htmlFor="email">Email: </label>
  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required/>
</div>

<div className="form-group">
   <label htmlFor="password">Password: </label>
   <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required/>
</div>
        
<div className="form-group">
    <label htmlFor="confirmPassword">Confirm Password: </label>
    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required/>
</div>
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;