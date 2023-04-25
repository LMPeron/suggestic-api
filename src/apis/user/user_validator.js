const CRUDValidator = require("../../commons/crud_validator");
const ErrorHandler = require("./../../utils/error_handler");
const UserSchema = require("./user_schema");

module.exports = class UserValidator extends CRUDValidator {
  constructor() {
    super("user", UserSchema.getSchema());
  }

  async validateLogin(req, res, next) {
    try {
      const userLoginSchema = UserSchema.getUserLoginSchema();
      const validationResult = userLoginSchema.validate(req.body);
      if (validationResult.error)
        ErrorHandler.handleError(validationResult.error);
    } catch (error) {
      return res
        .status(400)
        .send(`Invalid validation results: ${error.message}`);
    }
    return next();
  }
};
