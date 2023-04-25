const snippet = `
const { to } = require("await-to-js");
const CRUDController = require("../../commons/CRUD_controller");
const ErrorHandler = require('../../utils/error_handler');
const __nameCapital__Repository = require("./__nameLowerCase___repository");

module.exports = class __nameCapital__Controller extends CRUDController {
  constructor() {
    super("__nameLowerCase__", new __nameCapital__Repository());
  }
};
`;

module.exports = snippet;
