import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import '../styles/ItemForm.css';

export default function AddItem() {
  const [form, setForm] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    location: '',
    date: '',
    contactInfo: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/api/items', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-wrapper">
      <div className="form-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <div className="form-card slide-up">
        <div className="form-header">
          <Link to="/dashboard" className="back-btn">← Back</Link>
          <h1>Report an Item</h1>
          <p>Fill in the details about the lost or found item</p>
        </div>

        {error && <div className="alert alert-error shake">{error}</div>}

        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="itemName">Item Name</label>
              <input
                id="itemName"
                type="text"
                name="itemName"
                placeholder="e.g. Black Wallet"
                value={form.itemName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select id="type" name="type" value={form.type} onChange={handleChange}>
                <option value="Lost">❌ Lost</option>
                <option value="Found">✅ Found</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the item in detail..."
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="e.g. Library, Block A"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contactInfo">Contact Info</label>
            <input
              id="contactInfo"
              type="text"
              name="contactInfo"
              placeholder="Phone number or email"
              value={form.contactInfo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-footer">
            <Link to="/dashboard" className="btn-cancel">Cancel</Link>
            <button id="submit-item" type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner"></span> : '🚀 Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
