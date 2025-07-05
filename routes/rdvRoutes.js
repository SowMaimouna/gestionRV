const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  listerMedecins,
  prendreRdv,
  historiqueRdv, 
  decisionRdv,
  rdvMedecin
} = require('../controllers/rdvController');
 

router.get('/medecins', protect, listerMedecins);          // Voir tous les médecins + créneaux
router.post('/', protect, prendreRdv);                     // Prendre un rendez-vous
router.get('/mes-rdvs', protect, historiqueRdv);           // Voir mes rdvs
router.put('/:id/decision', protect, decisionRdv);
router.get('/mes-patients', protect, rdvMedecin);

module.exports = router;
