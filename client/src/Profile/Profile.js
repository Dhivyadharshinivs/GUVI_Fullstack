import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token
        const response = await axios.get(`http://localhost:5000/profile`, {
          headers: { Authorization: `Bearer ${token}` }, // Include token in header
        });
        setUserData(response.data);
        setFormData(response.data); // Initialize form data with user's details
      } catch (error) {
        console.error(error);
        setError('Failed to fetch user data');
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
 
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem('token', response.data.token); // Update token if needed
      setUserData(response.data); // Update displayed user data
      setError(''); // Clear any previous errors
      setFormData(response.data); // Reset form to updated values
    } catch (error) {
      setError(error.response.data.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="profile-details">
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="male">Male</option> 
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
          </div>
<div className="form-group">
   <label htmlFor="mobile">Mobile Number:</label>
            <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth:</label>
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
          </div>
          <button type="submit" className="update-button">Update Profile</button>
        </form>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;