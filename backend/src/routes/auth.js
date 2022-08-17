const express = require('express');
const router = express.Router();
const controller = require('../controller/auth');
const { requireSignIn } = require('../middleware');

router.post('/sign-in', controller.signIn);

router.post('/sign-up', controller.signUp);

router.post('/replace-password', requireSignIn, controller.replacePassword);

module.exports = router;
