const { options } = require('joi');
const Contact = require('./schemas/contact');

const getListContacts = async (userId, query) => {
  const { limit = 5, page = 1, sortBy, favorite = null } = query;
  const optionsSearch = { owner: userId };
  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  }
  const results = await Contact.paginate(optionsSearch, {
    limit, page, sort: { ...(sortBy) ? { [`&{sortBy}`]: 1 }:{}}
  });
  const { docs: contacts, totalDocs: total } = results;
  return {contacts, total, limit, page};
}

const getContactById = async (userId, contactId) => {
  const result = await Contact.findOne({_id: contactId, owner: userId }).populate({path:'owner', select:'email subscription -_id'})
    return result;
}

const addContact = async (body) => {
    const result = await Contact.create(body)
    return result;
}

const removeContact = async (userId, contactId) => {
  const result = await Contact.findByIdAndRemove({ _id:contactId, owner: userId });
    return result;
}

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate({ _id: contactId, owner: userId },{ ...body }, { new: true });
  return result;
}

const updateStatusContact = async (userId, contactId, body) => {
  const result = await Contact.findByIdAndUpdate({_id: contactId, owner:userId }, { ...body }, { new: true });
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
