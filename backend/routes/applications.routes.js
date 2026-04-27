const router = require('express').Router();
const ctrl   = require('../controllers/applications.controller');
const { verifyToken, isCompany, isCandidat } = require('../middleware/auth.middleware');

router.post('/',                              verifyToken, isCandidat, ctrl.apply);
router.get('/mine',                           verifyToken, isCandidat, ctrl.myApplications);
router.get('/job/:job_id',                    verifyToken, isCompany,  ctrl.getJobApplications);
router.patch('/:id/status',                   verifyToken, isCompany,  ctrl.updateApplicationStatus);

module.exports = router;
