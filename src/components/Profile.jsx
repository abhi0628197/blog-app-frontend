import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '/default-profile.png');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const username = localStorage.getItem('username') || 'User';
  const email = localStorage.getItem('email') || 'user@example.com';

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePic(url);
      setSelectedFile(file);
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setProfilePic(url);
      localStorage.setItem('profilePic', url);
      alert('✅ Profile picture saved!');
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <img src={profilePic} alt="Profile" className="profile-image-large" />
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Email:</strong> {email}</p>
      <input type="file" accept="image/*" onChange={handleProfilePicChange} />
      <button className="save-btn" onClick={handleSave}>Save</button>
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default Profile;
