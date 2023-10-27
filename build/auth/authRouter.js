"use strict";
const router = require('express').Router();
const AuthController = require('./authController');
router.post('/refresh-token', AuthController.RefreshToken);
module.exports = router;
