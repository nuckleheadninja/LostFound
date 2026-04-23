import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/ItemForm.css';

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    location: '',
    date: '',
    contactInfo: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/api/items/${id}`)
      .then(({ data }) => {
        setForm({
          itemName: data.itemName,
          description: data.description,
          type: data.type,
          location: data.location,
          date: data.date?.split('T')[0] || '',
          contactInfo: data.contactInfo,
        });
      })
      .catch(() => setError('Failed to load item'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await API.put(`/api/items/${id}`, form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating item');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="form-page-wrapper">
      <div className="loading-wrap"><div className="loader"></div><p>Loading...</p></div>
    </div>
  );

  return (
    <div className="form-page-wrapper">
      <div className="form-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <div className="form-card slide-up">
        <div className="form-header">
          <Link to="/dashboard" className="back-btn">← Back</Link>
          <h1>✏️ Edit Item</h1>
          <p>Update the details for this item</p>
        </div>

        {error && <div className="alert alert-error shake">{error}</div>}

        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="itemName">Item Name</label>
              <input id="itemName" type="text" name="itemName" value={form.itemName} onChange={handleChange} required />
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
            <textarea id="description" name="description" value={form.description} onChange={handleChange} required rows={3} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input id="location" type="text" name="location" value={form.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input id="date" type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contactInfo">Contact Info</label>
            <input id="contactInfo" type="text" name="contactInfo" value={form.contactInfo} onChange={handleChange} required />
          </div>

          <div className="form-footer">
            <Link to="/dashboard" className="btn-cancel">Cancel</Link>
            <button id="save-changes" type="submit" className="btn-primary" disabled={saving}>
              {saving ? <span className="spinner"></span> : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
