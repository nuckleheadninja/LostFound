const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());

// ======================
// Routes
// ======================
app.use('/api', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));

// ======================
// Protected Route
// ======================
const { protect } = require('./middleware/auth');

app.get('/dashboard', protect, (req, res) => {
  res.json({ message: `Welcome to the dashboard, ${req.user.name}!` });
});

// ======================
// Serve Frontend (Production)
// ======================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// ======================
// Fallback Route (IMPORTANT FIX)
// ======================
// This replaces app.get('*', ...) and avoids crash
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
});

// ======================
// Start Server + DB
// ======================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });