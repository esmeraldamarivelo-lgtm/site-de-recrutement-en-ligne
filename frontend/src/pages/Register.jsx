import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [mode, setMode] = useState('candidat');
  const [form, setForm] = useState({ nom: '', email: '', mot_de_passe: '', telephone: '', secteur: '', adresse: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (mode === 'candidat') {
        const res = await authAPI.registerUser(form);
        login(res.data.token, { ...res.data.user, type: 'user' });
        navigate('/');
      } else {
        const res = await authAPI.registerCompany(form);
        login(res.data.token, { ...res.data.company, type: 'company', role: 'company' });
        navigate('/societe');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 460, padding: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Créer un compte</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>

        <div style={{ display: 'flex', border: '1px solid var(--gray-border)', borderRadius: 6, overflow: 'hidden', marginBottom: 20 }}>
          {['candidat','societe'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '8px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: mode === m ? 'var(--blue)' : '#fff',
              color: mode === m ? '#fff' : 'var(--text-muted)'
            }}>
              {m === 'candidat' ? 'Je suis candidat' : 'Je recrute'}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{mode === 'candidat' ? 'Nom complet' : 'Nom de la société'}</label>
            <input className="form-control" name="nom" value={form.nom} onChange={handleChange}
              placeholder={mode === 'candidat' ? 'Jean Rakoto' : 'OrangeCo Digital'} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="votre@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input className="form-control" type="password" name="mot_de_passe"
              value={form.mot_de_passe} onChange={handleChange} placeholder="Min. 8 caractères" required minLength={8} />
          </div>
          <div className="form-group">
            <label className="form-label">Téléphone (optionnel)</label>
            <input className="form-control" name="telephone" value={form.telephone}
              onChange={handleChange} placeholder="+261 34 00 000 00" />
          </div>
          {mode === 'societe' && (
            <>
              <div className="form-group">
                <label className="form-label">Secteur d'activité</label>
                <input className="form-control" name="secteur" value={form.secteur}
                  onChange={handleChange} placeholder="Informatique, Finance…" />
              </div>
              <div className="form-group">
                <label className="form-label">Adresse</label>
                <input className="form-control" name="adresse" value={form.adresse}
                  onChange={handleChange} placeholder="Antananarivo, Madagascar" />
              </div>
            </>
          )}
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} type="submit" disabled={loading}>
            {loading ? 'Inscription…' : 'Créer mon compte'}
          </button>
        </form>
      </div>
    </div>
  );
}
