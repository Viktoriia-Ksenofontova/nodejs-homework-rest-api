const Joi = require('joi');

const schemaAddContact = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),
  
    phone: Joi.string()
        .required(),
    
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
});

const schemaUpdateContact = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .optional(),
  
    phone: Joi.string()
        .optional(),
    
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .optional()
}).min(1);




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