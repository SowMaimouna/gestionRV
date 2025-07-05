const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const medecinRoutes = require('./routes/medecinRoutes');
const rdvRoutes = require('./routes/rdvRoutes');

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
app.use('/api/medecins', medecinRoutes);
app.use('/api/rdvs', rdvRoutes);

module.exports = app;
