import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function JobDetail() {
  const { id }  = useParams();
  const { user, isCandidat } = useAuth();
  const navigate = useNavigate();
  const [job,     setJob]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [lettre,  setLettre]  = useState('');
  const [sending, setSending] = useState(false);
  const [msg,     setMsg]     = useState(null);

  useEffect(() => {
    jobsAPI.getJobById(id)
      .then(r => setJob(r.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePostuler = async () => {
    setSending(true); setMsg(null);
    try {
      await applicationsAPI.apply({ job_id: Number(id), lettre });
      setMsg({ type: 'success', text: 'Candidature envoyée avec succès !' });
      setModal(false);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Erreur lors de l\'envoi.' });
    } finally { setSending(false); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!job) return null;

  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 800 }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: 20 }}>← Retour</button>

      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'var(--blue-dark)', flexShrink: 0 }}>
            {job.company_nom?.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{job.titre}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{job.company_nom} · {job.localisation}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <span className="badge badge-blue">{job.type_contrat}</span>
          {job.experience && <span className="badge badge-gray">{job.experience}</span>}
          {job.salaire_min && <span className="badge badge-success">{Number(job.salaire_min).toLocaleString()} – {Number(job.salaire_max).toLocaleString()} Ar</span>}
        </div>

        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Description du poste</h2>
        <p style={{ lineHeight: 1.8, color: 'var(--text)', marginBottom: 20, whiteSpace: 'pre-wrap' }}>{job.description}</p>

        {job.competences && (
          <>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Compétences requises</h2>
            <p style={{ marginBottom: 20, color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{job.competences}</p>
          </>
        )}

        <div style={{ borderTop: '1px solid var(--gray-border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Publiée le {new Date(job.created_at).toLocaleDateString('fr-FR')}</p>
            {job.company_site && <a href={job.company_site} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>🌐 Site de l'entreprise</a>}
          </div>
          {!user && (
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Se connecter pour postuler</button>
          )}
          {isCandidat && (
            <button className="btn btn-primary" onClick={() => setModal(true)}>Postuler maintenant</button>
          )}
        </div>
      </div>

      {/* ── MODAL CANDIDATURE ── */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(false)}>×</button>
            <div className="modal-title">Postuler — {job.titre}</div>
            <div className="form-group">
              <label className="form-label">Lettre de motivation (optionnel)</label>
              <textarea className="form-control" rows={6} value={lettre}
                onChange={e => setLettre(e.target.value)}
                placeholder="Présentez-vous et expliquez votre motivation..." />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline flex-1" onClick={() => setModal(false)}>Annuler</button>
              <button className="btn btn-primary flex-1" onClick={handlePostuler} disabled={sending}>
                {sending ? 'Envoi…' : 'Envoyer ma candidature'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
