const express = require('express');
const router = express.Router();
const controllers = require('../../../controllers/contacts');
const { validateAddContact,
  validateUpdateContact,
  validateUpdateStatusContact,
  validateObjectId } = require('./validation');

const guard = require('../../../helpers/guard');

router.get('/', guard, controllers.getAll);

router.get('/:contactId', guard, validateObjectId, controllers.getById);

router.post('/', guard, validateAddContact, controllers.addContact);

router.delete('/:contactId', guard, validateObjectId, controllers.removeContact);

router.patch('/:contactId', guard, validateObjectId, validateUpdateContact, controllers.updateContact);

router.patch('/:contactId/favorite', guard, validateObjectId, validateUpdateStatusContact, controllers.updateContact);

module.exports = router
