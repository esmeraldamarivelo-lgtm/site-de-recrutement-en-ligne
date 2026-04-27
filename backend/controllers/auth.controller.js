const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../config/db');

// Génère un token JWT
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// ─── INSCRIPTION CANDIDAT ────────────────────────────────────
exports.registerUser = async (req, res) => {
  const { nom, email, mot_de_passe, telephone } = req.body;
  if (!nom || !email || !mot_de_passe)
    return res.status(400).json({ message: 'Nom, email et mot de passe requis.' });

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email déjà utilisé.' });

    const hash = await bcrypt.hash(mot_de_passe, 10);
    const [result] = await db.query(
      'INSERT INTO users (nom, email, mot_de_passe, telephone) VALUES (?, ?, ?, ?)',
      [nom, email, hash, telephone || null]
    );
    const token = generateToken({ id: result.insertId, email, role: 'candidat', type: 'user' });
    res.status(201).json({ token, user: { id: result.insertId, nom, email, role: 'candidat' } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── CONNEXION CANDIDAT / ADMIN ──────────────────────────────
exports.loginUser = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe)
    return res.status(400).json({ message: 'Email et mot de passe requis.' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Identifiants incorrects.' });

    const user = rows[0];
    const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!valid) return res.status(401).json({ message: 'Identifiants incorrects.' });

    const token = generateToken({ id: user.id, email: user.email, role: user.role, type: 'user' });
    res.json({
      token,
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role, type: 'user' }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── INSCRIPTION SOCIÉTÉ ─────────────────────────────────────
exports.registerCompany = async (req, res) => {
  const { nom, email, mot_de_passe, description, secteur, adresse, telephone, site_web } = req.body;
  if (!nom || !email || !mot_de_passe)
    return res.status(400).json({ message: 'Nom, email et mot de passe requis.' });

  try {
    const [existing] = await db.query('SELECT id FROM companies WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email déjà utilisé.' });

    const hash = await bcrypt.hash(mot_de_passe, 10);
    const [result] = await db.query(
      `INSERT INTO companies (nom, email, mot_de_passe, description, secteur, adresse, telephone, site_web)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, email, hash, description || null, secteur || null, adresse || null, telephone || null, site_web || null]
    );
    const token = generateToken({ id: result.insertId, email, role: 'company', type: 'company' });
    res.status(201).json({ token, company: { id: result.insertId, nom, email } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── CONNEXION SOCIÉTÉ ───────────────────────────────────────
exports.loginCompany = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe)
    return res.status(400).json({ message: 'Email et mot de passe requis.' });

  try {
    const [rows] = await db.query('SELECT * FROM companies WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Identifiants incorrects.' });

    const company = rows[0];
    if (company.statut === 'suspendu')
      return res.status(403).json({ message: 'Compte suspendu. Contactez l\'administrateur.' });

    const valid = await bcrypt.compare(mot_de_passe, company.mot_de_passe);
    if (!valid) return res.status(401).json({ message: 'Identifiants incorrects.' });

    const token = generateToken({ id: company.id, email: company.email, role: 'company', type: 'company' });
    res.json({
      token,
      company: { id: company.id, nom: company.nom, email: company.email, type: 'company' }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── PROFIL CONNECTÉ ─────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    if (req.user.type === 'company') {
      const [rows] = await db.query(
        'SELECT id, nom, email, description, secteur, adresse, telephone, logo_url, site_web, statut, created_at FROM companies WHERE id = ?',
        [req.user.id]
      );
      return res.json(rows[0]);
    }
    const [rows] = await db.query(
      'SELECT id, nom, email, role, telephone, cv_url, photo_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};
