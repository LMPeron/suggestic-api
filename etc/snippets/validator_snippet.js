const snippet = `
const CRUDValidator = require("../../commons/CRUD_validator");
const __nameCapital__Schema = require("./__nameLowerCase___schema");

module.exports = class __nameCapital__Validator extends CRUDValidator {
    constructor() {
        super("__nameLowerCase__", __nameCapital__Schema.getSchema());
    }
};
`;

module.exports = snippet;
