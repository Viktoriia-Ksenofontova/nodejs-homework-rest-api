const fs = require('fs/promises');
const path = require('path');
const contacts = path.join('model','contacts.json');
const { nanoid } = require('nanoid');

const listContacts = async () => {
  try {
    const data = await fs.readFile(contacts, 'utf-8');
    const results = JSON.parse(data);
    return results;
  } catch (err) {
    return err.message;
  } 
}

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contacts, 'utf-8');
    const results = JSON.parse(data);
    
    return results.find(result => result.id === contactId);
  } catch (err) {
    return err.message;
  }
}

const addContact = async ({ name, email, phone }) => {
  try {
    const data = await fs.readFile(contacts, 'utf-8');
    const allContacts = JSON.parse(data);
    const newContact = { id: nanoid(), name, email, phone };
    const newContactsList = JSON.stringify([newContact, ...allContacts], null, '\t');
    fs.writeFile(contacts, newContactsList);
    return newContact;
  } catch (err) {
    return err.message;
  }
}

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contacts, 'utf-8');
    const results = JSON.parse(data);
    const record = results.find(result => result.id === contactId);
    const newContactsList = results.filter(item => item.id !== contactId);
    fs.writeFile(contacts, JSON.stringify(newContactsList));
    return record;
  } catch (err) {
    return err.message;
  }
}



const updateContact = async (contactId, body) => {
   try {
    const data = await fs.readFile(contacts, 'utf-8');
     const results = JSON.parse(data);
     const record = results.find(item => item.id === contactId);
     if (record) {
       const newContactsList = results.map(result =>
         result.id === contactId ?
           { ...result, ...body } :
          result);
       fs.writeFile(contacts, JSON.stringify(newContactsList));
       return { ...record, ...body } ;
     }
    return null;
  } catch (err) {
    return err.message;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
