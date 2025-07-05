const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medecin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medecin',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  statut: {
    type: String,
    enum: ['en attente', 'confirmé', 'annulé'],
    default: 'en attente'
  }
}, { timestamps: true });

module.exports = mongoose.model('RendezVous', rendezVousSchema);
