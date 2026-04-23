import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import ItemDetail from './pages/ItemDetail';

// Protected route wrapper
function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add-item" element={<PrivateRoute><AddItem /></PrivateRoute>} />
        <Route path="/edit-item/:id" element={<PrivateRoute><EditItem /></PrivateRoute>} />
        <Route path="/item/:id" element={<PrivateRoute><ItemDetail /></PrivateRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
