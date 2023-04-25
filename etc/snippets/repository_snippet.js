const snippet = `
const CRUDRepository = require("../../commons/CRUD_repository");
const __nameCapital__Schema = require("./__nameLowerCase___schema");

module.exports = class __nameCapital__Repository extends CRUDRepository {
  constructor() {
    super("__nameLowerCase__", __nameCapital__Schema.getSchema());
  }
};
`;

module.exports = snippet;
