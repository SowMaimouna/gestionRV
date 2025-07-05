const Medecin = require('../models/Medecin');
const User = require('../models/User');

// @desc    Créer ou mettre à jour les infos du médecin
// @route   POST /api/medecins/profil
exports.createOrUpdateProfil = async (req, res) => {
  const { specialite } = req.body;

  try {
    let medecin = await Medecin.findOne({ user: req.user._id });

    if (medecin) {
      medecin.specialite = specialite;
      await medecin.save();
    } else {
      medecin = await Medecin.create({
        user: req.user._id,
        specialite,
        disponibilites: [],
      });
    }

    res.status(200).json(medecin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Ajouter des créneaux
// @route   POST /api/medecins/disponibilites
exports.ajouterDisponibilites = async (req, res) => {
  const { disponibilites } = req.body;

  try {
    const medecin = await Medecin.findOne({ user: req.user._id });

    if (!medecin) return res.status(404).json({ message: 'Médecin introuvable' });

    medecin.disponibilites.push(...disponibilites); // tableau de dates
    await medecin.save();

    res.status(200).json(medecin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Voir ses créneaux disponibles
// @route   GET /api/medecins/mes-disponibilites
exports.getDisponibilites = async (req, res) => {
  try {
    const medecin = await Medecin.findOne({ user: req.user._id });

    if (!medecin) return res.status(404).json({ message: 'Médecin introuvable' });

    res.status(200).json(medecin.disponibilites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
