const router = require('express').Router();
const { auth } = require('../auth/authMiddleware');
const accountController = require('../app/controller/account');

router.post('/login', accountController.Login);
router.post('/register', accountController.Register);
router.post('/register-external-account/', accountController.Register);

router.get('/get-account/', auth, accountController.GetAccount);
router.post('/forgot-password', accountController.ForgotPassWord);
router.put('/change-password', auth, accountController.ChangePassWord);

module.exports = router;

export {};