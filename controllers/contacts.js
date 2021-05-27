const Contacts = require('../model/contacts');
const mongoose = require('mongoose');
const { httpCode } = require("../helpers/constants");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contacts, total, limit, page } = await Contacts.getListContacts(userId, req.query);
    return res.status(httpCode.OK).json({
    status: 'success',
    code: httpCode.OK,
    data: { total, contacts, limit, page },
    })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    
    if (!mongoose.isValidObjectId(req.params.contactId)) {
      return res.status(httpCode.BAD_REQUEST).json({
      status: 'error',
      code: httpCode.BAD_REQUEST,
      message: 'incorrect id'
    })}
    const userId = req.user.id;
    const contact = await Contacts.getContactById(userId, req.params.contactId);
    if (contact) {
      return res.status(httpCode.OK).json({
        status: 'success',
        code: httpCode.OK,
        data: {contact},
      })
    }
    return res.status(httpCode.NOT_FOUND).json({
      ststus: 'error',
      code: httpCode.NOT_FOUND,
      message: 'Not found'
    })
  } catch (error) {
    next(error)
  }
}

const addContact= async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner:userId });
    return res.status(httpCode.CREATED).json({
    status: 'success',
    code: httpCode.CREATED,
    data: {
      contact,
    },
    })
  } catch (error) {
    next(error)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
    if (contact) {
      return res.status(httpCode.OK).json({
        status: 'success',
        code: httpCode.OK,
        message: "contact deleted",
      })
    }
    return res.status(httpCode.NOT_FOUND).json({
      ststus: 'error',
      code: httpCode.NOT_FOUND,
      message: 'Not Found'
    })
  } catch (error) {
    next(error)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(userId, req.params.contactId, req.body);
    if (contact) {
      return res.status(httpCode.OK).json({
        status: 'success',
        code: httpCode.OK,
        data: {contact},
      })
    }
    return res.status(httpCode.NOT_FOUND).json({
      ststus: 'error',
      code: httpCode.NOT_FOUND,
      message: 'Not Found'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getById,
  addContact,
  updateContact,
  removeContact
}