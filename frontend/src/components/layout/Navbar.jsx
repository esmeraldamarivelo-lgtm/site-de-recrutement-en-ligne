import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout, isAdmin, isCompany, isCandidat } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      background: '#fff', borderBottom: '1px solid var(--gray-border)',
      height: 56, display: 'flex', alignItems: 'center',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1140, margin: '0 auto' }}>

        {/* Logo */}
        <Link to="/" style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue)', textDecoration: 'none' }}>
          Talent<span style={{ color: 'var(--text)' }}>Connect</span>
        </Link>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>Offres</Link>

          {!user && (
            <>
              <Link to="/login"    className="btn btn-outline btn-sm">Se connecter</Link>
              <Link to="/register" className="btn btn-primary btn-sm">S'inscrire</Link>
            </>
          )}

          {isCandidat && (
            <>
              <Link to="/mes-candidatures" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>Mes candidatures</Link>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>👤 {user.nom}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Déconnexion</button>
            </>
          )}

          {isCompany && (
            <>
              <Link to="/societe"         style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>Tableau de bord</Link>
              <Link to="/societe/offres"  style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>Mes offres</Link>
              <Link to="/societe/publier" className="btn btn-primary btn-sm">+ Publier</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Déconnexion</button>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin"                  style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/admin/offres"           style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>Offres</Link>
              <Link to="/admin/utilisateurs"     style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>Utilisateurs</Link>
              <span className="badge badge-blue">Admin</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Déconnexion</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
