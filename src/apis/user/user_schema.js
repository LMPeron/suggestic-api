const Joi = require("joi");

module.exports = class UserSchema {
  static getSchema() {
    return Joi.object().keys({
      name: Joi.string().required().max(150),
      email: Joi.string().required().max(250),
      password: Joi.string().required().max(250),
    });
  }

  static getUserLoginSchema() {
    return Joi.object().keys({
      email: Joi.string().required().max(250),
      password: Joi.string().required().max(250),
    });
  }
};
