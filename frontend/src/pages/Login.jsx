import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [mode, setMode]   = useState('candidat'); // candidat | societe
  const [form, setForm]   = useState({ email: '', mot_de_passe: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) { navigate('/'); return null; }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      let res;
      if (mode === 'candidat') {
        res = await authAPI.loginUser(form);
        login(res.data.token, { ...res.data.user, type: 'user' });
        navigate(res.data.user.role === 'admin' ? '/admin' : '/');
      } else {
        res = await authAPI.loginCompany(form);
        login(res.data.token, { ...res.data.company, type: 'company', role: 'company' });
        navigate('/societe');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects.');
      console.error("erreur lors du login:", err);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Connexion</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>

        {/* Tabs mode */}
        <div style={{ display: 'flex', border: '1px solid var(--gray-border)', borderRadius: 6, overflow: 'hidden', marginBottom: 20 }}>
          {['candidat','societe'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '8px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: mode === m ? 'var(--blue)' : '#fff',
              color: mode === m ? '#fff' : 'var(--text-muted)'
            }}>
              {m === 'candidat' ? 'Je suis candidat' : 'Je suis une société'}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" name="email"
              value={form.email} onChange={handleChange} placeholder="votre@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input className="form-control" type="password" name="mot_de_passe"
              value={form.mot_de_passe} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} type="submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
