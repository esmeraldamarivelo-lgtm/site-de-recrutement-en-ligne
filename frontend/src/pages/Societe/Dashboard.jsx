import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DashboardSociete() {
  const { user }  = useAuth();
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsAPI.getMyJobs().then(r => setJobs(r.data)).finally(() => setLoading(false));
  }, []);

  const approuvees = jobs.filter(j => j.statut === 'approuve');
  const en_attente = jobs.filter(j => j.statut === 'en_attente');
  const refusees   = jobs.filter(j => j.statut === 'refuse');
  const totalCands = jobs.reduce((s, j) => s + (j.nb_candidatures || 0), 0);

  const STATUT_STYLE = {
    approuve:   { label: 'Approuvée',  cls: 'badge-success' },
    en_attente: { label: 'En attente', cls: 'badge-warning' },
    refuse:     { label: 'Refusée',    cls: 'badge-danger'  },
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Bienvenue, {user?.nom}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Tableau de bord recruteur</p>
        </div>
        <Link to="/societe/publier" className="btn btn-primary">+ Publier une offre</Link>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: 20 }}>
        ⚠️ Les offres publiées sont soumises à validation par l'administrateur avant d'être visibles par les candidats.
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Offres actives',     value: approuvees.length, color: 'var(--blue)'    },
          { label: 'En attente',         value: en_attente.length, color: 'var(--warning)' },
          { label: 'Refusées',           value: refusees.length,   color: 'var(--danger)'  },
          { label: 'Candidatures reçues',value: totalCands,        color: 'var(--text)'    },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tableau offres */}
      <div className="card">
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--gray-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>Mes offres d'emploi</span>
          <Link to="/societe/offres" style={{ fontSize: 12 }}>Gérer →</Link>
        </div>
        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Poste</th><th>Statut</th><th>Candidatures</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                {jobs.slice(0, 5).map(job => {
                  const s = STATUT_STYLE[job.statut] || { label: job.statut, cls: 'badge-gray' };
                  return (
                    <tr key={job.id}>
                      <td><div style={{ fontWeight: 500 }}>{job.titre}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{job.type_contrat}</div></td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td>{job.nb_candidatures || 0}</td>
                      <td style={{ fontSize: 12 }}>{new Date(job.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>
                        {job.statut === 'approuve' && (
                          <Link to={`/societe/candidatures/${job.id}`} className="btn btn-primary btn-sm">Candidatures</Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {jobs.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Aucune offre publiée.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
