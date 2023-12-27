const router = require('express').Router();
const { auth } = require('../auth/authMiddleware');
const accountController = require('../app/controller/account');
const upload = require('../app/middleware/cloudinaryMiddleware');

router.post('/login', accountController.Login);
router.post('/register', accountController.Register);
router.post('/register-external-account/', accountController.Register);

router.get('/get-account/', auth, accountController.GetAccount);
router.post('/forgot-password', accountController.ForgotPassWord);
router.put('/change-password', auth, accountController.ChangePassWord);
router.put('/update/avatar/:customer_id', auth, upload.single('avatar'), accountController.UpdateAvatar);

module.exports = router;

export {};
