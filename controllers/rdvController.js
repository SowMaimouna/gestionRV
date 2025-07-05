const RendezVous = require('../models/RendezVous');
const Medecin = require('../models/Medecin');

// @desc Obtenir la liste des médecins avec leurs créneaux
// @route GET /api/rdvs/medecins
exports.listerMedecins = async (req, res) => {
  try {
    const medecins = await Medecin.find().populate('user', 'nom prenom email');
    res.status(200).json(medecins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Prendre un rendez-vous
// @route POST /api/rdvs
exports.prendreRdv = async (req, res) => {
  const { medecinId, date } = req.body;

  try {
    const medecin = await Medecin.findById(medecinId);
    if (!medecin) return res.status(404).json({ message: 'Médecin introuvable' });

    const dateObj = new Date(date);

    // Vérifier si le créneau est disponible
    const dispo = medecin.disponibilites.find(
      (d) => new Date(d).getTime() === dateObj.getTime()
    );

    if (!dispo) {
      return res.status(400).json({ message: 'Ce créneau n’est pas disponible' });
    }

    // Créer le RDV
    const rdv = await RendezVous.create({
      patient: req.user._id,
      medecin: medecin._id,
      date: dateObj,
    });

    // Supprimer le créneau du médecin pour éviter double rdv
    medecin.disponibilites = medecin.disponibilites.filter(
      (d) => new Date(d).getTime() !== dateObj.getTime()
    );
    await medecin.save();

    res.status(201).json({ message: 'Rendez-vous pris avec succès', rdv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Voir ses propres rendez-vous
// @route GET /api/rdvs/mes-rdvs
exports.historiqueRdv = async (req, res) => {
  try {
    const rdvs = await RendezVous.find({ patient: req.user._id })
      .populate({
        path: 'medecin',
        populate: { path: 'user', select: 'nom prenom email' }
      })
      .sort({ date: 1 });

    res.status(200).json(rdvs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
