const express = require('express');
const router = express.Router();
const Contacts = require('../../model/index');
const {validateAddContact, validateUpdateContact, validateUpdateStatusContact} = require('./validation');

router.get('/', async (_req, res, next) => {
  try {
    const contacts = await Contacts.getListContacts();
    return res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      contacts,
    },
    })
  } catch (error) {
    next(error)
  }
  
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {contact},
      })
    }
    return res.status(404).json({
      ststus: 'error',
      code: 404,
      message: 'Not found'
    })
  } catch (error) {
    next(error)
  }
})

router.post('/', validateAddContact, async (req, res, next) => {
   try {
    const contact = await Contacts.addContact(req.body);
    return res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      contact,
    },
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: "contact deleted",
      })
    }
    return res.status(404).json({
      ststus: 'error',
      code: 404,
      message: 'Not Found'
    })
  } catch (error) {
    next(error)
  }
})

router.patch('/:contactId', validateUpdateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(req.params.contactId, req.body);
    if (contact) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {contact},
      })
    }
    return res.status(404).json({
      ststus: 'error',
      code: 404,
      message: 'Not Found'
    })
  } catch (error) {
    next(error)
  }
})

router.patch('/:contactId/favorite', validateUpdateStatusContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateStatusContact(req.params.contactId, req.body);
    if (contact) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {contact},
      })
    }
    return res.status(404).json({
      ststus: 'error',
      code: 404,
      message: 'Not Found'
    })
  } catch (error) {
      next(error)
  }
})

module.exports = router
