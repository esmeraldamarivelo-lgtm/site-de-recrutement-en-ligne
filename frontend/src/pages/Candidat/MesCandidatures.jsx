import { useState, useEffect } from 'react';
import { applicationsAPI } from '../../services/api.js';

const STATUT_STYLE = {
  nouvelle:  { label: 'Nouvelle',   cls: 'badge-blue'    },
  en_cours:  { label: 'En cours',   cls: 'badge-warning' },
  acceptee:  { label: 'Acceptée',   cls: 'badge-success' },
  refusee:   { label: 'Refusée',    cls: 'badge-danger'  },
};

export default function MesCandidatures() {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsAPI.myApplications()
      .then(r => setApps(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Mes candidatures</h1>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : apps.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Vous n'avez encore postulé à aucune offre.</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Voir les offres</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {apps.map(app => {
            const s = STATUT_STYLE[app.statut] || { label: app.statut, cls: 'badge-gray' };
            return (
              <div key={app.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{app.job_titre}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
                      {app.company_nom} · {app.localisation} · {app.type_contrat}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                      Postulé le {new Date(app.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <span className={`badge ${s.cls}`}>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
