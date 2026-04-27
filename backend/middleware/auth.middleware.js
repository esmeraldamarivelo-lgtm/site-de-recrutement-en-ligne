const jwt = require('jsonwebtoken');

// Vérifie que le token JWT est valide
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, type: 'user'|'company' }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expiré ou invalide.' });
  }
};

// Restreint l'accès aux admins uniquement
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé à l\'administrateur.' });
  }
  next();
};

// Restreint l'accès aux sociétés uniquement
const isCompany = (req, res, next) => {
  if (req.user.type !== 'company') {
    return res.status(403).json({ message: 'Accès réservé aux sociétés.' });
  }
  next();
};

// Restreint l'accès aux candidats uniquement
const isCandidat = (req, res, next) => {
  if (req.user.type !== 'user' || req.user.role === 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux candidats.' });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isCompany, isCandidat };
