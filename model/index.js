const Contact = require('./schemas/contact');

const getListContacts = async () => {
    const results = await Contact.find({})
    return results;
}

const getContactById = async (contactId) => {
    const result = await Contact.findById(contactId)
    return result;
}

const addContact = async (body) => {
    const result = await Contact.create(body)
    return result;
}

const removeContact = async (contactId) => {
    const result = await Contact.findByIdAndRemove(contactId);
    return result;
}

const updateContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(contactId, { ...body }, { new: true });
  return result;
}

const updateStatusContact = async (contactId, body) => {
  const result= await Contact.findByIdAndUpdate(contactId, { ...body }, { new: true });
  return result;
}

module.exports = {
  getListContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}
