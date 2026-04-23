import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/api/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="auth-card slide-up">
        <div className="auth-icon-wrap">
          <span className="auth-icon">🎒</span>
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the Lost & Found community</p>

        {error && <div className="alert alert-error shake">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              id="reg-name"
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              id="reg-email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              id="reg-password"
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <button id="reg-submit" type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
