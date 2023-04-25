const Joi = require("joi");

module.exports = class ItemSchema {
  static getSchema() {
    return Joi.object().keys({
      value: Joi.string().required(),
      formatted: Joi.object(),
    });
  }
};
