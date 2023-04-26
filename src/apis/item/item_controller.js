const CRUDController = require("../../commons/crud_controller");
const ItemRepository = require("./item_repository");
const ItemUtils = require("./item_utils");

module.exports = class ItemController extends CRUDController {
  constructor() {
    super("item", new ItemRepository());
  }

  async flattenItems(req, res) {
    try {
      const { items } = req.body;
      const flattenedItems = ItemUtils.flattenItems(items);
      return res.status(200).json({ result: flattenedItems });
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Flatting Items failed.`);
    }
  }

  async flattenItemsAndSave(req, res) {
    try {
      const { items } = req.body;
      const userId = req.user;
      const flattenedItems = ItemUtils.flattenItems(items);
      await this._repository.create(
        {
          value: JSON.stringify(items),
          formatted: JSON.stringify(flattenedItems),
        },
        userId
      );
      return res.status(200).json({ result: flattenedItems });
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Creating ${this._controllerName} failed.`);
    }
  }

  async getItemsHistoryByUser(req, res) {
    try {
      const userId = req.user;
      const itemHistory = await this._repository.getItemsHistoryByUser(userId);
      return res.status(200).json({ result: itemHistory });
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Get ${this._controllerName} failed.`);
    }
  }

  async getLastItemsHistoryByUser(req, res) {
    try {
      const userId = req.user;
      const itemHistory = await this._repository.getLastItemsHistoryByUser(
        userId,
        5
      );
      return res.status(200).json({ result: itemHistory });
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Get ${this._controllerName} failed.`);
    }
  }
};
