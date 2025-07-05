import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiBaseUrl from '../api/apiConfig';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setMsg(data.error || 'Login failed');
        return;
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', form.username);  // Store username
        navigate('/posts');
      } else {
        setMsg(data.error || 'Login failed');
      }

    } catch (err) {
      setMsg('Network error, please try again');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          className="login-input"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      {msg && <p className="login-msg">{msg}</p>}
      <p className="login-register">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
