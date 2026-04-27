import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../../services/api.js';

const STATUT_STYLE = {
  approuve:   { label: 'Approuvée',  cls: 'badge-success' },
  en_attente: { label: 'En attente', cls: 'badge-warning' },
  refuse:     { label: 'Refusée',    cls: 'badge-danger'  },
};

export default function GererOffres() {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState(null);
  const [motif,   setMotif]   = useState('');
  const [refusId, setRefusId] = useState(null);
  const [params, setParams]   = useSearchParams();
  const statut = params.get('statut') || '';

  const load = () => {
    setLoading(true);
    jobsAPI.getAllJobsAdmin({ statut })
      .then(r => setJobs(r.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [statut]);

  const approve = async (id) => {
    try {
      await jobsAPI.updateJobStatus(id, { statut: 'approuve' });
      setMsg({ type: 'success', text: 'Offre approuvée et publiée.' }); load();
    } catch { setMsg({ type: 'danger', text: 'Erreur.' }); }
  };

  const refuse = async () => {
    try {
      await jobsAPI.updateJobStatus(refusId, { statut: 'refuse', motif_refus: motif });
      setMsg({ type: 'success', text: 'Offre refusée.' });
      setRefusId(null); setMotif(''); load();
    } catch { setMsg({ type: 'danger', text: 'Erreur.' }); }
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Gestion des offres d'emploi</h1>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[{ v: '', l: 'Toutes' }, { v: 'en_attente', l: 'En attente' }, { v: 'approuve', l: 'Approuvées' }, { v: 'refuse', l: 'Refusées' }].map(f => (
          <button key={f.v} onClick={() => setParams(f.v ? { statut: f.v } : {})}
            className={`btn btn-sm ${statut === f.v ? 'btn-primary' : 'btn-outline'}`}>{f.l}</button>
        ))}
      </div>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Offre</th><th>Société</th><th>Type</th><th>Soumise le</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>
                {jobs.map(job => {
                  const s = STATUT_STYLE[job.statut] || { label: job.statut, cls: 'badge-gray' };
                  return (
                    <tr key={job.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{job.titre}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{job.localisation}</div>
                      </td>
                      <td>{job.company_nom}</td>
                      <td>{job.type_contrat}</td>
                      <td style={{ fontSize: 12 }}>{new Date(job.created_at).toLocaleDateString('fr-FR')}</td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {job.statut !== 'approuve' && (
                            <button className="btn btn-success btn-sm" onClick={() => approve(job.id)}>Approuver</button>
                          )}
                          {job.statut !== 'refuse' && (
                            <button className="btn btn-danger btn-sm" onClick={() => setRefusId(job.id)}>Refuser</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {jobs.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Aucune offre.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal refus */}
      {refusId && (
        <div className="modal-overlay" onClick={() => setRefusId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setRefusId(null)}>×</button>
            <div className="modal-title">Refuser cette offre</div>
            <div className="form-group">
              <label className="form-label">Motif du refus (optionnel)</label>
              <textarea className="form-control" rows={4} value={motif}
                onChange={e => setMotif(e.target.value)}
                placeholder="Expliquez à la société pourquoi l'offre est refusée..." />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline flex-1" onClick={() => setRefusId(null)}>Annuler</button>
              <button className="btn btn-danger flex-1" onClick={refuse}>Confirmer le refus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
