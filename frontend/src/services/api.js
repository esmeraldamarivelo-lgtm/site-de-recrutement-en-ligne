import axios from 'axios';

const api = axios.create({
  baseURL: 'https://talent-o1lf.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

// Injecter automatiquement le token JWT dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Rediriger vers /login si le token est expiré
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tc_token');
      localStorage.removeItem('tc_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ──────────────────────────────────────────
export const authAPI = {
  registerUser:    (data) => api.post('/auth/register',         data),
  loginUser:       (data) => api.post('/auth/login',            data),
  registerCompany: (data) => api.post('/auth/company/register', data),
  loginCompany:    (data) => api.post('/auth/company/login',    data),
  getProfile:      ()     => api.get('/auth/profile'),
};

// ─── JOBS ──────────────────────────────────────────
export const jobsAPI = {
  getJobs:          (params) => api.get('/jobs',              { params }),
  getJobById:       (id)     => api.get(`/jobs/${id}`),
  getMyJobs:        ()       => api.get('/jobs/company/mine'),
  createJob:        (data)   => api.post('/jobs',             data),
  updateJob:        (id, d)  => api.put(`/jobs/${id}`,        d),
  deleteJob:        (id)     => api.delete(`/jobs/${id}`),
  getAllJobsAdmin:   (params) => api.get('/jobs/admin/all',    { params }),
  updateJobStatus:  (id, d)  => api.patch(`/jobs/admin/${id}/status`, d),
};

// ─── APPLICATIONS ──────────────────────────────────
export const applicationsAPI = {
  apply:                  (data)   => api.post('/applications',                    data),
  myApplications:         ()       => api.get('/applications/mine'),
  getJobApplications:     (job_id) => api.get(`/applications/job/${job_id}`),
  updateApplicationStatus:(id, d)  => api.patch(`/applications/${id}/status`,      d),
};

// ─── ADMIN ─────────────────────────────────────────
export const adminAPI = {
  getStats:             ()       => api.get('/admin/stats'),
  getUsers:             ()       => api.get('/admin/users'),
  deleteUser:           (id)     => api.delete(`/admin/users/${id}`),
  getCompanies:         ()       => api.get('/admin/companies'),
  updateCompanyStatus:  (id, d)  => api.patch(`/admin/companies/${id}/status`, d),
  deleteCompany:        (id)     => api.delete(`/admin/companies/${id}`),
};

export default api;
