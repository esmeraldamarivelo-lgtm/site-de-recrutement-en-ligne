const router = require('express').Router();
const ctrl   = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.use(verifyToken, isAdmin);

router.get('/stats',                    ctrl.getStats);
router.get('/users',                    ctrl.getUsers);
router.delete('/users/:id',             ctrl.deleteUser);
router.get('/companies',                ctrl.getCompanies);
router.patch('/companies/:id/status',   ctrl.updateCompanyStatus);
router.delete('/companies/:id',         ctrl.deleteCompany);

module.exports = router;
