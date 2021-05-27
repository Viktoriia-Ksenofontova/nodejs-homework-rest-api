const express = require('express');
const router = express.Router();
const controllers = require('../../../controllers/contacts');
const {validateAddContact, validateUpdateContact, validateUpdateStatusContact} = require('./validation');
const guard = require('../../../helpers/guard');

router.get('/', guard, controllers.getAll);

router.get('/:contactId', guard, controllers.getById);

router.post('/', guard, validateAddContact, controllers.addContact);

router.delete('/:contactId', guard, controllers.removeContact);

router.patch('/:contactId', guard, validateUpdateContact, controllers.updateContact);

router.patch('/:contactId/favorite', guard, validateUpdateStatusContact, controllers.updateContact);

module.exports = router
