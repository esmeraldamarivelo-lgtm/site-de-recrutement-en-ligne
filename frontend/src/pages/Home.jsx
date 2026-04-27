import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const TYPE_COLORS = {
  CDI: 'badge-success', CDD: 'badge-blue', Stage: 'badge-warning',
  Freelance: 'badge-gray', Alternance: 'badge-blue'
};

export default function Home() {
  const [jobs,    setJobs]    = useState([]);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [loc,     setLoc]     = useState('');
  const [contrat, setContrat] = useState('');
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const fetchJobs = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await jobsAPI.getJobs({ search, localisation: loc, type_contrat: contrat, page: p, limit: 8 });
      setJobs(data.jobs); setTotal(data.total); setPages(data.pages); setPage(p);
    } catch { /* silencieux */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(1); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchJobs(1); };

  const handlePostuler = (jobId) => {
    if (!user) { navigate('/login'); return; }
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div>
      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(135deg,#042C53,#185FA5)', padding: '48px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Trouvez votre prochain emploi
        </h1>
        <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 14, marginBottom: 28 }}>
          Des milliers d'offres auprès des meilleures entreprises
        </p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, maxWidth: 640, margin: '0 auto', flexWrap: 'wrap' }}>
          <input className="form-control" style={{ flex: 2 }} placeholder="Poste, mot-clé…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <input className="form-control" style={{ flex: 1 }} placeholder="Ville…"
            value={loc} onChange={e => setLoc(e.target.value)} />
          <select className="form-control" style={{ flex: 1 }} value={contrat} onChange={e => setContrat(e.target.value)}>
            <option value="">Tous contrats</option>
            {['CDI','CDD','Stage','Freelance','Alternance'].map(t => <option key={t}>{t}</option>)}
          </select>
          <button className="btn btn-primary" type="submit">Rechercher</button>
        </form>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: 'var(--blue-light)', padding: '12px 24px', display: 'flex', justifyContent: 'center', gap: 48, borderBottom: '1px solid rgba(26,111,212,.15)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--blue-dark)' }}>{total}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Offres disponibles</div>
        </div>
      </div>

      {/* ── LISTE OFFRES ── */}
      <div className="container" style={{ padding: '24px 20px' }}>
        {!user && (
          <div className="alert alert-info" style={{ marginBottom: 20 }}>
            <strong>Connectez-vous pour postuler</strong> — L'inscription est gratuite et rapide.
            <a href="/register" style={{ marginLeft: 8, fontWeight: 600 }}>Créer un compte →</a>
          </div>
        )}

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-muted" style={{ padding: 60 }}>Aucune offre trouvée.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
            {jobs.map(job => (
              <div key={job.id} className="card" style={{ padding: 16, cursor: 'pointer' }}
                onClick={() => navigate(`/jobs/${job.id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--blue-dark)', fontSize: 13 }}>
                    {job.company_nom?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`badge ${TYPE_COLORS[job.type_contrat] || 'badge-gray'}`}>{job.type_contrat}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{job.titre}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{job.company_nom} · {job.localisation}</div>
                {job.salaire_min && (
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue)', marginBottom: 8 }}>
                    {Number(job.salaire_min).toLocaleString()} – {Number(job.salaire_max).toLocaleString()} Ar
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--gray-border)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {new Date(job.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  <button className="btn btn-primary btn-sm"
                    onClick={e => { e.stopPropagation(); handlePostuler(job.id); }}>
                    Postuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => fetchJobs(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
