// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  motDePasse: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'medecin'],
    required: true
  }
}, { timestamps: true });

// Hasher le mot de passe avant enregistrement
userSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  next();
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = function (motDePasseEntrant) {
  return bcrypt.compare(motDePasseEntrant, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);
