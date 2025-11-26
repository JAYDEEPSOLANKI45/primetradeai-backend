const Joi = require("joi");
// const JoiObjectId = require('joi-objectid')(Joi);

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().optional(),
  status: Joi.string().valid("pending", "completed").required(),
  createdBy: Joi.forbidden(),
});

module.exports = {
  registerSchema,
  loginSchema,
  taskSchema,
};
