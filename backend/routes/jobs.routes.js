const router = require('express').Router();
const ctrl   = require('../controllers/jobs.controller');
const { verifyToken, isAdmin, isCompany } = require('../middleware/auth.middleware');

// Public
router.get('/',           ctrl.getJobs);
router.get('/:id',        ctrl.getJobById);

// Société
router.get('/company/mine',       verifyToken, isCompany, ctrl.getMyJobs);
router.post('/',                  verifyToken, isCompany, ctrl.createJob);
router.put('/:id',                verifyToken, isCompany, ctrl.updateJob);
router.delete('/:id',             verifyToken, isCompany, ctrl.deleteJob);

// Admin
router.get('/admin/all',          verifyToken, isAdmin, ctrl.getAllJobsAdmin);
router.patch('/admin/:id/status', verifyToken, isAdmin, ctrl.updateJobStatus);

module.exports = router;
