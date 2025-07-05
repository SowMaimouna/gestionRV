const RendezVous = require('../models/RendezVous');
const Medecin = require('../models/Medecin');
const User = require('../models/User');
const sendEmail = require('../utils/email');

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


// @desc    Le médecin confirme ou refuse un RDV
// @route   PUT /api/rdvs/:id/decision
exports.decisionRdv = async (req, res) => {
  const { statut } = req.body; // 'confirmé' ou 'annulé'
  const rdvId = req.params.id;

  if (!['confirmé', 'annulé'].includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  try {
    const rdv = await RendezVous.findById(rdvId).populate('patient medecin');

    if (!rdv) return res.status(404).json({ message: 'RDV introuvable' });

    // Vérifier que c’est bien le médecin concerné
    const medecinConnecte = await Medecin.findOne({ user: req.user._id });
    if (!medecinConnecte || rdv.medecin._id.toString() !== medecinConnecte._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à traiter ce RDV' });
    }

    rdv.statut = statut;
    await rdv.save();

    // Récupérer email du patient
    const patientUser = await User.findById(rdv.patient._id);

    // Email
    const texte =
      statut === 'confirmé'
        ? `Bonjour ${patientUser.prenom}, votre rendez-vous avec le Dr ${req.user.prenom} est confirmé pour le ${rdv.date.toLocaleString()}.`
        : `Bonjour ${patientUser.prenom}, votre rendez-vous avec le Dr ${req.user.prenom} a été annulé. Veuillez en prendre un autre.`;

    await sendEmail(patientUser.email, `Statut de votre RDV`, texte);
console.log("📨 Envoi de mail à:", patientUser.email);

    res.status(200).json({ message: `RDV ${statut}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @desc Voir les rdvs reçus pour un médecin
// @route GET /api/rdvs/mes-patients
exports.rdvMedecin = async (req, res) => {
  try {
    const medecin = await Medecin.findOne({ user: req.user._id });
    if (!medecin) return res.status(404).json({ message: 'Médecin introuvable' });

    const rdvs = await RendezVous.find({ medecin: medecin._id })
      .populate('patient', 'nom prenom email')
      .sort({ date: 1 });

    res.status(200).json(rdvs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
