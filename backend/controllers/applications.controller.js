const db = require('../config/db');

// ─── POSTULER (candidat) ─────────────────────────────────────
exports.apply = async (req, res) => {
  const { job_id, lettre, cv_url } = req.body;
  if (!job_id) return res.status(400).json({ message: 'ID de l\'offre requis.' });

  try {
    // Vérifier que l'offre est approuvée
    const [job] = await db.query('SELECT id FROM jobs WHERE id = ? AND statut = "approuve"', [job_id]);
    if (!job.length) return res.status(404).json({ message: 'Offre introuvable ou non disponible.' });

    // Vérifier doublon
    const [existing] = await db.query(
      'SELECT id FROM applications WHERE job_id = ? AND user_id = ?', [job_id, req.user.id]
    );
    if (existing.length) return res.status(409).json({ message: 'Vous avez déjà postulé à cette offre.' });

    const [result] = await db.query(
      'INSERT INTO applications (job_id, user_id, lettre, cv_url) VALUES (?, ?, ?, ?)',
      [job_id, req.user.id, lettre || null, cv_url || null]
    );
    res.status(201).json({ message: 'Candidature envoyée avec succès.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── MES CANDIDATURES (candidat) ─────────────────────────────
exports.myApplications = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.statut, a.created_at, a.lettre,
              j.titre AS job_titre, j.localisation, j.type_contrat,
              c.nom AS company_nom, c.logo_url AS company_logo
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.user_id = ?
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── CANDIDATURES D'UNE OFFRE (société) ──────────────────────
exports.getJobApplications = async (req, res) => {
  try {
    // S'assurer que l'offre appartient à la société
    const [job] = await db.query(
      'SELECT id FROM jobs WHERE id = ? AND company_id = ?', [req.params.job_id, req.user.id]
    );
    if (!job.length) return res.status(404).json({ message: 'Offre introuvable.' });

    const [rows] = await db.query(
      `SELECT a.id, a.statut, a.lettre, a.cv_url, a.created_at,
              u.nom AS candidat_nom, u.email AS candidat_email,
              u.telephone AS candidat_telephone, u.cv_url AS profil_cv
       FROM applications a
       JOIN users u ON a.user_id = u.id
       WHERE a.job_id = ?
       ORDER BY a.created_at DESC`,
      [req.params.job_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── METTRE À JOUR LE STATUT D'UNE CANDIDATURE (société) ─────
exports.updateApplicationStatus = async (req, res) => {
  const { statut } = req.body;
  if (!['en_cours', 'acceptee', 'refusee'].includes(statut))
    return res.status(400).json({ message: 'Statut invalide.' });

  try {
    // Vérifier que la candidature concerne bien une offre de la société
    const [rows] = await db.query(
      `SELECT a.id FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ? AND j.company_id = ?`,
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Candidature introuvable.' });

    await db.query('UPDATE applications SET statut = ? WHERE id = ?', [statut, req.params.id]);
    res.json({ message: 'Statut mis à jour.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};
