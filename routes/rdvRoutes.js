const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  listerMedecins,
  prendreRdv,
  historiqueRdv
} = require('../controllers/rdvController');

router.get('/medecins', protect, listerMedecins);          // Voir tous les médecins + créneaux
router.post('/', protect, prendreRdv);                     // Prendre un rendez-vous
router.get('/mes-rdvs', protect, historiqueRdv);           // Voir mes rdvs

module.exports = router;
