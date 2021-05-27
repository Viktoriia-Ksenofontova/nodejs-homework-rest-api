const express = require('express');
const router = express.Router();
const controllers = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
const {validateSignup, validateLogin, validateUpdate} = require('./validation')

router.post('/signup', validateSignup, controllers.signup);
router.post('/login', validateLogin, controllers.login);
router.post('/logout', guard, controllers.logout);

router.get('/current', guard, controllers.currentUser);
router.patch('/', guard, validateUpdate, controllers.updateSubscription);

module.exports = router;
