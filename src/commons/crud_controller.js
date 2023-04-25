const Logger = require("../utils/logger");
const AbstractChecker = require("../utils/abstract_checker");

module.exports = class CRUDController {
  constructor(controllerName, repository) {
    AbstractChecker.check(this, new.target, ["create", "update"]);
    this._controllerName = controllerName;
    this._repository = repository;
    this._logger = new Logger(`controller-${this._controllerName}`).getLogger();
  }

  async create(req, res) {
    try {
      const entity = req.body;
      const data = await this._repository.create(entity);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Creating ${this._controllerName} failed.`);
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const entity = req.body;
      const data = await this._repository.update(id, entity);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Updating ${this._controllerName} failed.`);
    }
  }

  async index(req, res) {
    try {
      const queryParams = req.query;
      const data = await this._repository.getAll(queryParams);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Get all ${this._controllerName}s failed.`);
    }
  }

  async read(req, res) {
    try {
      const id = req.params.id;
      const data = await this._repository.get(id);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Get ${this._controllerName} failed.`);
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const data = await this._repository.delete(id);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Deleting ${this._controllerName} failed.`);
    }
  }
};
