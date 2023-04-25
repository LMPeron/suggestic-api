const CRUDRepository = require("../../commons/crud_repository");
const UserSchema = require("./user_schema");

module.exports = class UserRepository extends CRUDRepository {
  constructor() {
    super("user", UserSchema.getSchema());
  }

  async findByEmail(email) {
    const query = this.formatSql(
      `SELECT * FROM ${this._tableName} WHERE email = ?`,
      [email]
    );
    const results = await this.execute(query);
    return results[0] || null;
  }
};
