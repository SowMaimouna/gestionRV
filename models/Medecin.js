const mongoose = require('mongoose');

const medecinSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialite: {
    type: String,
    required: true
  },
  disponibilites: [
    {
      type: Date
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Medecin', medecinSchema);
