const CRUDValidator = require("../../commons/crud_validator");
const ItemSchema = require("./item_schema");

module.exports = class ItemValidator extends CRUDValidator {
  constructor() {
    super("item", ItemSchema.getSchema());
  }
};
