import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchItems = async () => {
    try {
      const { data } = await API.get('/api/items');
      setItems(data);
      setFiltered(data);
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login');
    fetchItems();
  }, []);

  useEffect(() => {
    let result = items;
    if (filterType !== 'All') result = result.filter((i) => i.type === filterType);
    if (search.trim()) {
      result = result.filter((i) =>
        i.itemName.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, filterType, items]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/api/items/${id}`);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting item');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="navbar fade-in">
        <div className="nav-brand">
          <span className="nav-logo">🔍</span>
          <span>Lost & Found</span>
        </div>
        <div className="nav-actions">
          <span className="nav-user">👋 {user.name}</span>
          <Link id="btn-add-item" to="/add-item" className="btn-nav-add">+ Report Item</Link>
          <button id="btn-logout" className="btn-nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Stats */}
        <div className="stats-row fade-in-delay">
          <div className="stat-card">
            <div className="stat-number">{items.length}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-card lost">
            <div className="stat-number">{items.filter(i => i.type === 'Lost').length}</div>
            <div className="stat-label">Lost</div>
          </div>
          <div className="stat-card found">
            <div className="stat-number">{items.filter(i => i.type === 'Found').length}</div>
            <div className="stat-label">Found</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="search-bar fade-in-delay">
          <div className="search-input-wrap">
            <span className="search-icon">🔎</span>
            <input
              id="search-input"
              type="text"
              placeholder="Search items by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {['All', 'Lost', 'Found'].map((t) => (
              <button
                key={t}
                id={`filter-${t.toLowerCase()}`}
                className={`filter-tab ${filterType === t ? 'active' : ''}`}
                onClick={() => setFilterType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="loading-wrap">
            <div className="loader"></div>
            <p>Loading items...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state fade-in">
            <div className="empty-icon">📭</div>
            <h3>No items found</h3>
            <p>Try a different search or <Link to="/add-item">report a new item</Link></p>
          </div>
        ) : (
          <div className="items-grid">
            {filtered.map((item, idx) => (
              <div
                key={item._id}
                className="item-card"
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                <div className={`item-badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}`}>
                  {item.type === 'Lost' ? '❌ Lost' : '✅ Found'}
                </div>
                <h3 className="item-name">{item.itemName}</h3>
                <p className="item-desc">{item.description}</p>
                <div className="item-meta">
                  <span>📍 {item.location}</span>
                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                  <span>📞 {item.contactInfo}</span>
                  <span>👤 {item.postedBy?.name}</span>
                </div>
                <div className="item-actions">
                  <Link id={`view-${item._id}`} to={`/item/${item._id}`} className="btn-view">View</Link>
                  {item.postedBy?._id === user._id && (
                    <>
                      <Link id={`edit-${item._id}`} to={`/edit-item/${item._id}`} className="btn-edit">Edit</Link>
                      <button id={`delete-${item._id}`} className="btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
