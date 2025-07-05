const express = require('express');
const router = express.Router();
const {
  createOrUpdateProfil,
  ajouterDisponibilites,
  getDisponibilites,
  supprimerCreneau,
  modifierCreneau
} = require('../controllers/medecinController');


const protect = require('../middlewares/authMiddleware');

// Toutes ces routes nécessitent une authentification
router.post('/profil', protect, createOrUpdateProfil);
router.post('/disponibilites', protect, ajouterDisponibilites);
router.get('/mes-disponibilites', protect, getDisponibilites);
router.delete('/disponibilites/:date', protect, supprimerCreneau);
router.put('/disponibilites', protect, modifierCreneau);

module.exports = router;
