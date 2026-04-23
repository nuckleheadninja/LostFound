import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/ItemDetail.css';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    API.get(`/api/items/${id}`)
      .then(({ data }) => setItem(data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this item?')) return;
    await API.delete(`/api/items/${id}`);
    navigate('/dashboard');
  };

  if (loading) return (
    <div className="detail-wrapper">
      <div className="loading-wrap"><div className="loader"></div><p>Loading...</p></div>
    </div>
  );

  return (
    <div className="detail-wrapper">
      <div className="detail-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <div className="detail-card slide-up">
        <div className="detail-header">
          <Link to="/dashboard" className="back-btn">← Dashboard</Link>
          <span className={`detail-badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}`}>
            {item.type === 'Lost' ? '❌ Lost' : '✅ Found'}
          </span>
        </div>
        <h1 className="detail-title">{item.itemName}</h1>
        <p className="detail-description">{item.description}</p>

        <div className="detail-info-grid">
          <div className="detail-info-card">
            <span className="info-icon">📍</span>
            <div>
              <div className="info-label">Location</div>
              <div className="info-value">{item.location}</div>
            </div>
          </div>
          <div className="detail-info-card">
            <span className="info-icon">📅</span>
            <div>
              <div className="info-label">Date</div>
              <div className="info-value">{new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          <div className="detail-info-card">
            <span className="info-icon">📞</span>
            <div>
              <div className="info-label">Contact Info</div>
              <div className="info-value">{item.contactInfo}</div>
            </div>
          </div>
          <div className="detail-info-card">
            <span className="info-icon">👤</span>
            <div>
              <div className="info-label">Posted By</div>
              <div className="info-value">{item.postedBy?.name} ({item.postedBy?.email})</div>
            </div>
          </div>
          <div className="detail-info-card">
            <span className="info-icon">🕐</span>
            <div>
              <div className="info-label">Reported On</div>
              <div className="info-value">{new Date(item.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {item.postedBy?._id === user._id && (
          <div className="detail-actions">
            <Link id="edit-item-btn" to={`/edit-item/${item._id}`} className="btn-edit-lg">✏️ Edit Item</Link>
            <button id="delete-item-btn" className="btn-delete-lg" onClick={handleDelete}>🗑️ Delete Item</button>
          </div>
        )}
      </div>
    </div>
  );
}
