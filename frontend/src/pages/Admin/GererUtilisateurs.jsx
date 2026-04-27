import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api.js';

export default function GererUtilisateurs() {
  const [tab,       setTab]      = useState('companies'); // companies | users
  const [companies, setCompanies] = useState([]);
  const [users,     setUsers]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [msg,       setMsg]       = useState(null);

  const loadAll = () => {
    setLoading(true);
    Promise.all([adminAPI.getCompanies(), adminAPI.getUsers()])
      .then(([c, u]) => { setCompanies(c.data); setUsers(u.data); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadAll(); }, []);

  const toggleCompany = async (id, current) => {
    const statut = current === 'actif' ? 'suspendu' : 'actif';
    try {
      await adminAPI.updateCompanyStatus(id, { statut });
      setMsg({ type: 'success', text: `Société ${statut === 'actif' ? 'réactivée' : 'suspendue'}.` });
      loadAll();
    } catch { setMsg({ type: 'danger', text: 'Erreur.' }); }
  };

  const deleteCompany = async (id) => {
    if (!window.confirm('Supprimer définitivement cette société et toutes ses offres ?')) return;
    try { await adminAPI.deleteCompany(id); setMsg({ type: 'success', text: 'Société supprimée.' }); loadAll(); }
    catch { setMsg({ type: 'danger', text: 'Erreur.' }); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Supprimer ce candidat ?')) return;
    try { await adminAPI.deleteUser(id); setMsg({ type: 'success', text: 'Candidat supprimé.' }); loadAll(); }
    catch { setMsg({ type: 'danger', text: 'Erreur.' }); }
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Gestion des utilisateurs</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setTab('companies')} className={`btn btn-sm ${tab === 'companies' ? 'btn-primary' : 'btn-outline'}`}>
          Sociétés ({companies.length})
        </button>
        <button onClick={() => setTab('users')} className={`btn btn-sm ${tab === 'users' ? 'btn-primary' : 'btn-outline'}`}>
          Candidats ({users.length})
        </button>
      </div>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (

        tab === 'companies' ? (
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Société</th><th>Email</th><th>Secteur</th><th>Offres</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {companies.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 500 }}>{c.nom}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.email}</td>
                      <td>{c.secteur || '—'}</td>
                      <td>{c.nb_offres}</td>
                      <td>
                        <span className={`badge ${c.statut === 'actif' ? 'badge-success' : 'badge-danger'}`}>
                          {c.statut === 'actif' ? 'Active' : 'Suspendue'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => toggleCompany(c.id, c.statut)}
                            className={`btn btn-sm ${c.statut === 'actif' ? 'btn-outline' : 'btn-success'}`}>
                            {c.statut === 'actif' ? 'Suspendre' : 'Réactiver'}
                          </button>
                          <button onClick={() => deleteCompany(c.id)} className="btn btn-danger btn-sm">Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {companies.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Aucune société.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Inscrit le</th><th>Action</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.nom}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</td>
                      <td>{u.telephone || '—'}</td>
                      <td style={{ fontSize: 12 }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <button onClick={() => deleteUser(u.id)} className="btn btn-danger btn-sm">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Aucun candidat.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}
