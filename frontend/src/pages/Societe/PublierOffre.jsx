import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../../services/api.js';

const INITIAL = { titre: '', description: '', competences: '', localisation: '', type_contrat: 'CDI', salaire_min: '', salaire_max: '', experience: '', expires_at: '' };

export default function PublierOffre() {
  const [form,    setForm]    = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState(null);
  const [params]  = useSearchParams();
  const editId    = params.get('edit');
  const navigate  = useNavigate();

  useEffect(() => {
    if (editId) {
      // Charger les données existantes pour modification
      jobsAPI.getMyJobs().then(r => {
        const job = r.data.find(j => j.id === Number(editId));
        if (job) setForm({
          titre:        job.titre        || '',
          description:  job.description  || '',
          competences:  job.competences  || '',
          localisation: job.localisation || '',
          type_contrat: job.type_contrat || 'CDI',
          salaire_min:  job.salaire_min  || '',
          salaire_max:  job.salaire_max  || '',
          experience:   job.experience   || '',
          expires_at:   job.expires_at   ? job.expires_at.split('T')[0] : '',
        });
      });
    }
  }, [editId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setMsg(null); setLoading(true);
    try {
      if (editId) {
        await jobsAPI.updateJob(editId, form);
        setMsg({ type: 'success', text: 'Offre modifiée. Elle sera revalidée par l\'administrateur.' });
      } else {
        await jobsAPI.createJob(form);
        setMsg({ type: 'success', text: 'Offre soumise avec succès ! En attente de validation.' });
        setForm(INITIAL);
      }
      setTimeout(() => navigate('/societe/offres'), 1500);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Erreur lors de la soumission.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ padding: '32px 20px', maxWidth: 700 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
        {editId ? 'Modifier l\'offre' : 'Publier une offre d\'emploi'}
      </h1>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="card" style={{ padding: 24 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Titre du poste *</label>
            <input className="form-control" name="titre" value={form.titre}
              onChange={handleChange} placeholder="Ex : Développeur Full-Stack" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Type de contrat *</label>
              <select className="form-control" name="type_contrat" value={form.type_contrat} onChange={handleChange}>
                {['CDI','CDD','Stage','Freelance','Alternance'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Localisation</label>
              <input className="form-control" name="localisation" value={form.localisation}
                onChange={handleChange} placeholder="Antananarivo" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Salaire min (Ar)</label>
              <input className="form-control" type="number" name="salaire_min"
                value={form.salaire_min} onChange={handleChange} placeholder="1 500 000" />
            </div>
            <div className="form-group">
              <label className="form-label">Salaire max (Ar)</label>
              <input className="form-control" type="number" name="salaire_max"
                value={form.salaire_max} onChange={handleChange} placeholder="2 500 000" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Expérience requise</label>
              <input className="form-control" name="experience" value={form.experience}
                onChange={handleChange} placeholder="2 ans minimum" />
            </div>
            <div className="form-group">
              <label className="form-label">Date d'expiration</label>
              <input className="form-control" type="date" name="expires_at"
                value={form.expires_at} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description du poste *</label>
            <textarea className="form-control" name="description" value={form.description}
              onChange={handleChange} rows={6} placeholder="Décrivez les missions, le contexte, les attentes…" required />
          </div>

          <div className="form-group">
            <label className="form-label">Compétences requises</label>
            <textarea className="form-control" name="competences" value={form.competences}
              onChange={handleChange} rows={3} placeholder="React, Node.js, SQL…" />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/societe/offres')}>Annuler</button>
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Envoi en cours…' : editId ? 'Enregistrer les modifications' : 'Soumettre l\'offre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
