const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');
const accountRoutes = require('./routes/accountRoutes');
const messageRoutes = require('./routes/messageRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
require('dotenv').config();

const app = express();
console.log('Server starting with index.js'); // Log initial

// Middleware
console.log('Applying middleware: cors and json'); // Log pour les middlewares
app.use(cors());
app.use(express.json());

// Routes
console.log('Mounting routes: /api/auth'); app.use('/api/auth', authRoutes);
console.log('Mounting routes: /api/objectifs'); app.use('/api/objectifs', goalRoutes);
console.log('Mounting routes: /api/comptes'); app.use('/api/comptes', accountRoutes);
console.log('Mounting routes: /api/messages'); app.use('/api/messages', messageRoutes);

// Error handling
console.log('Applying error middleware'); app.use(errorMiddleware);

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
    console.log('Database connection successful, starting route validation'); // Log après connexion
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));