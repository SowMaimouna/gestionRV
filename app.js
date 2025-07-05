const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('API de rendez-vous médicaux opérationnelle 🎉');
});

app.use('/api/auth', authRoutes);

module.exports = app;
