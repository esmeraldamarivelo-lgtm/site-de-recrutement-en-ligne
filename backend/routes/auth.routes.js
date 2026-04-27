const router     = require('express').Router();
const ctrl       = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/register',         ctrl.registerUser);
router.post('/login',            ctrl.loginUser);
router.post('/company/register', ctrl.registerCompany);
router.post('/company/login',    ctrl.loginCompany);
router.get('/profile',           verifyToken, ctrl.getProfile);

module.exports = router;
