import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api.js';

const STATUT_STYLE = {
  approuve:   { label: 'Approuvée',  cls: 'badge-success' },
  en_attente: { label: 'En attente', cls: 'badge-warning' },
  refuse:     { label: 'Refusée',    cls: 'badge-danger'  },
};

export default function MesOffres() {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState(null);

  const load = () => jobsAPI.getMyJobs().then(r => setJobs(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette offre ?')) return;
    try {
      await jobsAPI.deleteJob(id);
      setMsg({ type: 'success', text: 'Offre supprimée.' });
      load();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Erreur.' });
    }
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Mes offres d'emploi</h1>
        <Link to="/societe/publier" className="btn btn-primary">+ Publier une offre</Link>
      </div>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Poste</th><th>Type</th><th>Statut</th><th>Candidatures</th><th>Motif refus</th><th>Actions</th></tr></thead>
              <tbody>
                {jobs.map(job => {
                  const s = STATUT_STYLE[job.statut] || { label: job.statut, cls: 'badge-gray' };
                  return (
                    <tr key={job.id}>
                      <td style={{ fontWeight: 500 }}>{job.titre}</td>
                      <td>{job.type_contrat}</td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td>{job.nb_candidatures || 0}</td>
                      <td style={{ fontSize: 12, color: 'var(--danger)', maxWidth: 160 }}>{job.motif_refus || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {job.statut === 'approuve' && (
                            <Link to={`/societe/candidatures/${job.id}`} className="btn btn-primary btn-sm">Candidatures</Link>
                          )}
                          <Link to={`/societe/publier?edit=${job.id}`} className="btn btn-outline btn-sm">Modifier</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {jobs.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
                    Aucune offre. <Link to="/societe/publier">Publier votre première offre →</Link>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
