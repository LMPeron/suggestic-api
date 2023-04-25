const CRUDRepository = require("../../commons/crud_repository");
const ItemSchema = require("./item_schema");

module.exports = class ItemRepository extends CRUDRepository {
  constructor() {
    super("item", ItemSchema.getSchema());
  }

  // TODO add DataSource layer for clean architecture

  async create(item, userId) {
    const createdItem = await super.create(item);
    const query = this.formatSql(
      `INSERT INTO user_item (user_id, item_id) VALUES (?, ?)`,
      [userId, createdItem.id]
    );
    await this.execute(query);
    return createdItem;
  }

  async getItemsHistoryByUser(userId) {
    const query = this.formatSql(
      `SELECT ${this._tableName}.*, user_item.created_at 
       FROM ${this._tableName} 
       JOIN user_item ON ${this._tableName}.id = user_item.item_id 
       WHERE user_item.user_id = ?`,
      [userId]
    );
    const results = await this.execute(query);
    return results;
  }

  async getLastItemsHistoryByUser(userId, limit = 10) {
    const query = this.formatSql(
      `SELECT ${this._tableName}.*, user_item.created_at 
       FROM ${this._tableName} 
       JOIN user_item ON ${this._tableName}.id = user_item.item_id 
       WHERE user_item.user_id = ? 
       ORDER BY user_item.created_at DESC 
       LIMIT ?`,
      [userId, limit]
    );
    const results = await this.execute(query);
    return results;
  }

  async delete(id) {
    const deleteQuery = this.formatSql(
      `DELETE FROM user_item WHERE item_id = ?`,
      [id]
    );
    await this.execute(deleteQuery);
    await super.delete(id);
  }
};
