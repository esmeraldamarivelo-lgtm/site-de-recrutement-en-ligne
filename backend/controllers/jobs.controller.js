const db = require('../config/db');

// ─── LISTE DES OFFRES APPROUVÉES (public) ────────────────────
exports.getJobs = async (req, res) => {
  const { search, localisation, type_contrat, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  let where = ['j.statut = "approuve"'];
  const params = [];

  if (search) {
    where.push('(j.titre LIKE ? OR j.description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (localisation) { where.push('j.localisation LIKE ?'); params.push(`%${localisation}%`); }
  if (type_contrat) { where.push('j.type_contrat = ?'); params.push(type_contrat); }

  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';

  try {
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM jobs j ${whereStr}`, params
    );
    const [rows] = await db.query(
      `SELECT j.id, j.titre, j.localisation, j.type_contrat, j.salaire_min, j.salaire_max,
              j.experience, j.created_at, c.nom AS company_nom, c.logo_url AS company_logo
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       ${whereStr}
       ORDER BY j.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );
    res.json({ jobs: rows, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── DÉTAIL D'UNE OFFRE (public) ─────────────────────────────
exports.getJobById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT j.*, c.nom AS company_nom, c.logo_url AS company_logo,
              c.description AS company_description, c.site_web AS company_site
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       WHERE j.id = ? AND j.statut = "approuve"`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Offre introuvable.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── OFFRES DE LA SOCIÉTÉ CONNECTÉE ──────────────────────────
exports.getMyJobs = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT j.*, COUNT(a.id) AS nb_candidatures
       FROM jobs j
       LEFT JOIN applications a ON j.id = a.job_id
       WHERE j.company_id = ?
       GROUP BY j.id
       ORDER BY j.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── CRÉER UNE OFFRE (société) ───────────────────────────────
exports.createJob = async (req, res) => {
  const { titre, description, competences, localisation, type_contrat,
          salaire_min, salaire_max, experience, expires_at } = req.body;
  if (!titre || !description)
    return res.status(400).json({ message: 'Titre et description requis.' });

  try {
    const [result] = await db.query(
      `INSERT INTO jobs (company_id, titre, description, competences, localisation, type_contrat,
                         salaire_min, salaire_max, experience, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, titre, description, competences || null, localisation || null,
       type_contrat || 'CDI', salaire_min || null, salaire_max || null,
       experience || null, expires_at || null]
    );
    res.status(201).json({ message: 'Offre soumise. En attente de validation.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── MODIFIER UNE OFFRE (société) ────────────────────────────
exports.updateJob = async (req, res) => {
  const { titre, description, competences, localisation, type_contrat,
          salaire_min, salaire_max, experience, expires_at } = req.body;
  try {
    const [rows] = await db.query('SELECT id FROM jobs WHERE id = ? AND company_id = ?',
      [req.params.id, req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'Offre introuvable.' });

    await db.query(
      `UPDATE jobs SET titre=?, description=?, competences=?, localisation=?, type_contrat=?,
       salaire_min=?, salaire_max=?, experience=?, expires_at=?, statut='en_attente', motif_refus=NULL
       WHERE id = ?`,
      [titre, description, competences || null, localisation || null,
       type_contrat || 'CDI', salaire_min || null, salaire_max || null,
       experience || null, expires_at || null, req.params.id]
    );
    res.json({ message: 'Offre modifiée. En attente de revalidation.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── SUPPRIMER UNE OFFRE (société) ───────────────────────────
exports.deleteJob = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id FROM jobs WHERE id = ? AND company_id = ?',
      [req.params.id, req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'Offre introuvable.' });
    await db.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Offre supprimée.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── ADMIN : toutes les offres ───────────────────────────────
exports.getAllJobsAdmin = async (req, res) => {
  const { statut } = req.query;
  const where = statut ? 'WHERE j.statut = ?' : '';
  try {
    const [rows] = await db.query(
      `SELECT j.*, c.nom AS company_nom FROM jobs j
       JOIN companies c ON j.company_id = c.id
       ${where} ORDER BY j.created_at DESC`,
      statut ? [statut] : []
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// ─── ADMIN : valider / refuser une offre ─────────────────────
exports.updateJobStatus = async (req, res) => {
  const { statut, motif_refus } = req.body;
  if (!['approuve', 'refuse'].includes(statut))
    return res.status(400).json({ message: 'Statut invalide.' });
  try {
    await db.query('UPDATE jobs SET statut = ?, motif_refus = ? WHERE id = ?',
      [statut, motif_refus || null, req.params.id]);
    res.json({ message: `Offre ${statut === 'approuve' ? 'approuvée' : 'refusée'}.` });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};
