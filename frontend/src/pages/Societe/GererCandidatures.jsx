import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationsAPI } from '../../services/api.js';

const STATUTS = ['en_cours', 'acceptee', 'refusee'];
const STATUT_STYLE = {
  nouvelle:  { label: 'Nouvelle',    cls: 'badge-blue'    },
  en_cours:  { label: 'En cours',    cls: 'badge-warning' },
  acceptee:  { label: 'Acceptée',    cls: 'badge-success' },
  refusee:   { label: 'Refusée',     cls: 'badge-danger'  },
};

export default function GererCandidatures() {
  const { jobId }  = useParams();
  const navigate   = useNavigate();
  const [apps,     setApps]    = useState([]);
  const [loading,  setLoading] = useState(true);
  const [msg,      setMsg]     = useState(null);

  const load = () =>
    applicationsAPI.getJobApplications(jobId)
      .then(r => setApps(r.data))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, [jobId]);

  const handleStatus = async (id, statut) => {
    try {
      await applicationsAPI.updateApplicationStatus(id, { statut });
      setMsg({ type: 'success', text: 'Statut mis à jour.' });
      load();
    } catch {
      setMsg({ type: 'danger', text: 'Erreur lors de la mise à jour.' });
    }
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <button onClick={() => navigate('/societe/offres')} className="btn btn-outline btn-sm" style={{ marginBottom: 20 }}>← Retour aux offres</button>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Candidatures reçues</h1>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      {loading ? <div className="loading-center"><div className="spinner" /></div> :
        apps.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            Aucune candidature reçue pour cette offre.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {apps.map(app => {
              const s = STATUT_STYLE[app.statut] || { label: app.statut, cls: 'badge-gray' };
              return (
                <div key={app.id} className="card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{app.candidat_nom}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{app.candidat_email} · {app.candidat_telephone || 'N/A'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Postulé le {new Date(app.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <span className={`badge ${s.cls}`}>{s.label}</span>
                  </div>

                  {app.lettre && (
                    <div style={{ background: 'var(--gray-bg)', borderRadius: 6, padding: 12, fontSize: 13, marginBottom: 12, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
                      <strong style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>LETTRE DE MOTIVATION</strong>
                      {app.lettre}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>Changer le statut :</span>
                    {STATUTS.map(st => (
                      <button key={st} disabled={app.statut === st}
                        className={`btn btn-sm ${app.statut === st ? 'btn-outline' : 'btn-outline'}`}
                        onClick={() => handleStatus(app.id, st)}
                        style={{ opacity: app.statut === st ? 0.4 : 1 }}>
                        {STATUT_STYLE[st]?.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
