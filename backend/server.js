require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

// ─── MIDDLEWARES ─────────────────────────────────────────────
app.use(cors({
  origin:      'http://localhost:5173', // URL du frontend Vite
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── ROUTES ──────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth.routes'));
app.use('/api/jobs',         require('./routes/jobs.routes'));
app.use('/api/applications', require('./routes/applications.routes'));
app.use('/api/admin',        require('./routes/admin.routes'));

// ─── ROUTE PAR DÉFAUT ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 API Talent Connect opérationnelle', version: '1.0.0' });
});

// ─── ROUTE 404 ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable.' });
});

// ─── GESTIONNAIRE D'ERREURS GLOBAL ───────────────────────────
app.use((err, req, res, next) => {
  console.error('Erreur globale :', err);
  res.status(500).json({ message: 'Erreur interne du serveur.', error: err.message });
});

// ─── DÉMARRAGE ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur Talent Connect lancé sur http://localhost:${PORT}`);
  console.log(`📌 Environnement : ${process.env.NODE_ENV}`);
});
