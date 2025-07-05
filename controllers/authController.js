const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer un token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Inscription
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { nom, prenom, email, motDePasse, role } = req.body;

  if (!nom || !prenom || !email || !motDePasse || !role) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: 'Utilisateur déjà existant' });
  }

  const user = await User.create({ nom, prenom, email, motDePasse, role });

  res.status(201).json({
    _id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// @desc    Connexion
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Utilisateur introuvable' });

  const isMatch = await user.comparePassword(motDePasse);
  if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

  res.json({
    _id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};
