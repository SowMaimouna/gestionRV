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

// @desc    Supprimer un créneau spécifique
// @route   DELETE /api/medecins/disponibilites/:date
exports.supprimerCreneau = async (req, res) => {
  const dateASupprimer = new Date(req.params.date); // ex: 2025-07-06T14:00:00.000Z

  try {
    const medecin = await Medecin.findOne({ user: req.user._id });
    if (!medecin) return res.status(404).json({ message: 'Médecin introuvable' });

    medecin.disponibilites = medecin.disponibilites.filter(
      (d) => d.getTime() !== dateASupprimer.getTime()
    );

    await medecin.save();
    res.status(200).json({ message: 'Créneau supprimé', disponibilites: medecin.disponibilites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @desc    Modifier un créneau (remplacer une date)
// @route   PUT /api/medecins/disponibilites
exports.modifierCreneau = async (req, res) => {
  const { ancienCreneau, nouveauCreneau } = req.body;

  try {
    const medecin = await Medecin.findOne({ user: req.user._id });
    if (!medecin) return res.status(404).json({ message: 'Médecin introuvable' });

    const index = medecin.disponibilites.findIndex(
      (d) => d.getTime() === new Date(ancienCreneau).getTime()
    );

    if (index === -1) return res.status(404).json({ message: 'Créneau non trouvé' });

    medecin.disponibilites[index] = new Date(nouveauCreneau);
    await medecin.save();

    res.status(200).json({ message: 'Créneau modifié', disponibilites: medecin.disponibilites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
