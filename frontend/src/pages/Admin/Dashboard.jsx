import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api.js';

export default function DashboardAdmin() {
  const [stats,   setStats]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: 'Offres à valider',    value: stats.jobs_pending,       color: 'var(--warning)', link: '/admin/offres?statut=en_attente' },
    { label: 'Offres actives',      value: stats.total_jobs,         color: 'var(--success)', link: '/admin/offres' },
    { label: 'Sociétés',            value: stats.total_companies,    color: 'var(--blue)',    link: '/admin/utilisateurs' },
    { label: 'Candidats inscrits',  value: stats.total_users,        color: 'var(--text)',    link: '/admin/utilisateurs' },
    { label: 'Total candidatures',  value: stats.total_applications, color: 'var(--text)',    link: '#' },
  ];

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Tableau de bord — Administration</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12, marginBottom: 32 }}>
          {kpis.map(k => (
            <Link to={k.link} key={k.label} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: 18 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: k.color }}>{k.value ?? '…'}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Accès rapides</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/admin/offres?statut=en_attente" className="btn btn-primary">📋 Valider les offres en attente</Link>
            <Link to="/admin/utilisateurs"             className="btn btn-outline">👥 Gérer les utilisateurs</Link>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Informations</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8 }}>
            <p>• Les offres publiées par les sociétés doivent être approuvées ici avant d'être visibles.</p>
            <p>• Vous pouvez suspendre ou supprimer les comptes sociétés depuis la gestion des utilisateurs.</p>
            <p>• Le compte admin par défaut est : <strong>admin@talentconnect.mg</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
