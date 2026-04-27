import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Layout
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

// Pages publiques
import Home          from './pages/Home.jsx';
import JobDetail     from './pages/JobDetail.jsx';
import Login         from './pages/Login.jsx';
import Register      from './pages/Register.jsx';

// Espace Candidat
import MesCandidatures from './pages/Candidat/MesCandidatures.jsx';

// Espace Société
import DashboardSociete  from './pages/Societe/Dashboard.jsx';
import MesOffres         from './pages/Societe/MesOffres.jsx';
import PublierOffre      from './pages/Societe/PublierOffre.jsx';
import GererCandidatures from './pages/Societe/GererCandidatures.jsx';

// Espace Admin
import DashboardAdmin  from './pages/Admin/Dashboard.jsx';
import GererOffres     from './pages/Admin/GererOffres.jsx';
import GererUtilisateurs from './pages/Admin/GererUtilisateurs.jsx';

// Guards
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner"/></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role || user.type)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/"           element={<Home />} />
          <Route path="/jobs/:id"   element={<JobDetail />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />

          {/* CANDIDAT */}
          <Route path="/mes-candidatures" element={
            <PrivateRoute roles={['candidat']}>
              <MesCandidatures />
            </PrivateRoute>
          }/>

          {/* SOCIÉTÉ */}
          <Route path="/societe" element={
            <PrivateRoute roles={['company']}>
              <DashboardSociete />
            </PrivateRoute>
          }/>
          <Route path="/societe/offres" element={
            <PrivateRoute roles={['company']}>
              <MesOffres />
            </PrivateRoute>
          }/>
          <Route path="/societe/publier" element={
            <PrivateRoute roles={['company']}>
              <PublierOffre />
            </PrivateRoute>
          }/>
          <Route path="/societe/candidatures/:jobId" element={
            <PrivateRoute roles={['company']}>
              <GererCandidatures />
            </PrivateRoute>
          }/>

          {/* ADMIN */}
          <Route path="/admin" element={
            <PrivateRoute roles={['admin']}>
              <DashboardAdmin />
            </PrivateRoute>
          }/>
          <Route path="/admin/offres" element={
            <PrivateRoute roles={['admin']}>
              <GererOffres />
            </PrivateRoute>
          }/>
          <Route path="/admin/utilisateurs" element={
            <PrivateRoute roles={['admin']}>
              <GererUtilisateurs />
            </PrivateRoute>
          }/>

          {/* 404 */}
          <Route path="*" element={
            <div className="container text-center" style={{ paddingTop: 80 }}>
              <h1 style={{ fontSize: 64, color: 'var(--blue)' }}>404</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Page introuvable</p>
              <a href="/" className="btn btn-primary">Retour à l'accueil</a>
            </div>
          }/>
        </Routes>
      </main>
      <Footer />
    </>
  );
}
