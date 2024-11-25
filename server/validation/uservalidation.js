const Joi = require('joi');

// Schema for validating user registration data
const validateRegistration = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    favoriteGenre: Joi.string().optional(),
  });
  return schema.validate(data);
};

// Schema for validating user login data
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports = { validateRegistration, validateLogin };