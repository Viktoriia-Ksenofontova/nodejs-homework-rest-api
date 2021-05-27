const Joi = require('joi');

const schemaSignup = Joi.object({
    password: Joi.string()
        .min(6)
        .max(30)
        .required(),
       
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
});

const schemaLogin = Joi.object({
    password: Joi.string()
        .min(6)
        .max(30)
        .required(),
       
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
});

const schemaUpdateSubscription = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

const validate = async(schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next()
}
  catch (err) {
    next({status:400, message:err.message})
   }
}
 
module.exports.validateSignup = (req, _res, next) => {
  return validate(schemaSignup, req.body, next)
}
module.exports.validateLogin = (req, _res, next) => {
  return validate(schemaLogin, req.body, next)
}
module.exports.validateUpdate = (req, _res, next) => {
  return validate(schemaUpdateSubscription, req.body, next)
}
