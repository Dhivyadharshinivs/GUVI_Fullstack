import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', formData);
      localStorage.setItem('token', response.data.token); // Store the token in localStorage
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      setError(error.response.data.message || 'Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Log In</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>

<div className="form-group">
    <label htmlFor="email">Email: </label> 
    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required/>
</div>

<div className="form-group">
    <label htmlFor="password">Password: </label>
    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
</div>

        <button type="submit" className="login-button">Log In</button>
      </form>
    </div>
  );
}

export default Login;