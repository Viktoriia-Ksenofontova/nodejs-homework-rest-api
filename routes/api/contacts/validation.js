const Joi = require('joi');
const mongoose = require('mongoose')
const { httpCode } = require("../../../helpers/constants");

const schemaAddContact = Joi.object({
    name: Joi.string()
        .min(2)
        .max(30)
        .required(),
  
    phone: Joi.string()
        .required(),
    
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),

    favorite:Joi.boolean(),
});

const schemaUpdateContact = Joi.object({
    name: Joi.string()
        .min(2)
        .max(30)
        .optional(),
  
    phone: Joi.string()
        .optional(),
    
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .optional(),
    
     favorite:Joi.boolean(),
}).min(1);

const schemaUpdateStatus = Joi.object({
  favorite:Joi.boolean().required(),
})


const validate = async(schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next()
}
  catch (err) {
    next({status:400, message:err.message})
   }
}
 
module.exports.validateAddContact = (req, _res, next) => {
  return validate(schemaAddContact, req.body, next)
}
module.exports.validateUpdateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}
module.exports.validateUpdateStatusContact = (req, _res, next) => {
  return validate(schemaUpdateStatus, req.body, next)
}

module.exports.validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
    return next({
      status: httpCode.BAD_REQUEST,
      message: 'incorrect id'
    })
  }
  next()
}