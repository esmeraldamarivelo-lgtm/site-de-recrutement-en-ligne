const db = require('../config/db');

// ─── STATISTIQUES GLOBALES ────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [[{ total_users }]]       = await db.query('SELECT COUNT(*) AS total_users FROM users WHERE role = "candidat"');
    const [[{ total_companies }]]   = await db.query('SELECT COUNT(*) AS total_companies FROM companies');
    const [[{ total_jobs }]]        = await db.query('SELECT COUNT(*) AS total_jobs FROM jobs WHERE statut = "approuve"');
    const [[{ jobs_pending }]]      = await db.query('SELECT COUNT(*) AS jobs_pending FROM jobs WHERE statut = "en_attente"');
    const [[{ total_applications }]]= await db.query('SELECT COUNT(*) AS total_applications FROM applications');
    res.json({ total_users, total_companies, total_jobs, jobs_pending, total_applications });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── LISTE DES CANDIDATS ──────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nom, email, telephone, created_at FROM users WHERE role = "candidat" ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── SUPPRIMER UN CANDIDAT ───────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ? AND role = "candidat"', [req.params.id]);
    res.json({ message: 'Candidat supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── LISTE DES SOCIÉTÉS ───────────────────────────────────────
exports.getCompanies = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.nom, c.email, c.secteur, c.statut, c.created_at,
              COUNT(j.id) AS nb_offres
       FROM companies c
       LEFT JOIN jobs j ON c.id = j.company_id
       GROUP BY c.id ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── CHANGER STATUT D'UNE SOCIÉTÉ ────────────────────────────
exports.updateCompanyStatus = async (req, res) => {
  const { statut } = req.body;
  if (!['actif', 'suspendu'].includes(statut))
    return res.status(400).json({ message: 'Statut invalide.' });
  try {
    await db.query('UPDATE companies SET statut = ? WHERE id = ?', [statut, req.params.id]);
    res.json({ message: `Société ${statut === 'actif' ? 'activée' : 'suspendue'}.` });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── SUPPRIMER UNE SOCIÉTÉ ────────────────────────────────────
exports.deleteCompany = async (req, res) => {
  try {
    await db.query('DELETE FROM companies WHERE id = ?', [req.params.id]);
    res.json({ message: 'Société supprimée.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};
