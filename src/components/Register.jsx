import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiBaseUrl from '../api/apiConfig';
import './Register.css';  // Create this CSS file

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setMsg(data.error || 'Registration failed');
        return;
      }

      if (data.message) {
        setMsg('✅ Registration successful! Redirecting...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMsg(data.error || 'Registration failed');
      }

    } catch {
      setMsg('Network error, please try again');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          className="register-input"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          className="register-input"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="register-input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" className="register-button">Register</button>
      </form>
      {msg && <p className="register-msg">{msg}</p>}
      <p className="register-login">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
