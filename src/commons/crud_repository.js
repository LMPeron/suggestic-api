const mysql = require("mysql");
const uuidv1 = require("uuid/v1");
const AbstractChecker = require("../utils/abstract_checker");
const SchemaConverter = require("../utils/schema_converter");
const DatabaseConnection = require("./database_connection");

module.exports = class CRUDRepository {
  constructor(tableName, schema) {
    AbstractChecker.check(this, new.target, ["create", "update"]);
    this._tableName = tableName;
    this._schema = schema;
    this._db = new DatabaseConnection();
  }

  generateId() {
    return uuidv1();
  }

  formatSql(query, valueArray) {
    return mysql.format(query, valueArray);
  }

  async execute(query) {
    return await this._db.executeQuery(query);
  }

  async getAll(queryParams) {
    const PAGE_SIZE_DEFAULT = 100;
    const schemaKeys = SchemaConverter.getSchemaKeys(this._schema);
    const filterKeys = Object.keys(queryParams)
      .filter((key) => schemaKeys.includes(key))
      .map((key) => `${key} = ?`);
    const filterValues = Object.values(queryParams)
      .filter((value) => value !== undefined)
      .slice(0, filterKeys.length);
    const where =
      filterKeys.length > 0 ? `WHERE ${filterKeys.join(" AND ")}` : "";
    const query = this.formatSql(
      `SELECT * FROM ${this._tableName} ${where} ORDER BY updated_at DESC LIMIT ?`,
      [...filterValues, queryParams.pageSize ?? PAGE_SIZE_DEFAULT]
    );
    return await this.execute(query);
  }

  async getCount() {
    const query = `SELECT COUNT(*) as count FROM ${this._tableName}`;
    const result = await this.execute(query);
    return result[0].count;
  }

  async create(entity) {
    const id = this.generateId();
    const { query, values } = await this.buildInsertQuery(entity, id);
    const formattedSql = this.formatSql(query, values);
    const result = await this.execute(formattedSql);
    if (result && result.affectedRows === 1) {
      return {
        entity: this._tableName,
        id,
        status: "created",
      };
    }
    return null;
  }

  async buildInsertQuery(entity, id) {
    const keys = SchemaConverter.getSchemaKeys(this._schema);
    const setKeys = ["id"];
    const values = [id];
    for (const key of keys) {
      if (entity.hasOwnProperty(key)) {
        setKeys.push(key);
        values.push(entity[key]);
      }
    }

    const placeholders = new Array(setKeys.length).fill("?").join(",");

    const query = this.formatSql(
      `INSERT INTO ${this._tableName} (${setKeys.join(
        ","
      )}) VALUES (${placeholders})`
    );
    return { query, values };
  }

  async update(id, entity) {
    const keys = SchemaConverter.getSchemaKeys(this._schema);
    const values = keys.reduce((acc, key) => {
      if (entity.hasOwnProperty(key)) {
        acc.push(entity[key]);
      }
      return acc;
    }, []);
    values.push(id);
    const setClause = keys
      .filter((key) => entity.hasOwnProperty(key))
      .map((key) => `${key}=?`)
      .join(",");
    const query = this.formatSql(
      `update ${this._tableName} set ${setClause} where id = ?`,
      values
    );
    const result = await this.execute(query);
    if (result && result.affectedRows === 1)
      return {
        entity: this._tableName,
        id,
        status: "updated",
      };
    return null;
  }

  async get(id) {
    const query = mysql.format("SELECT * FROM ?? WHERE id = ?", [
      this._tableName,
      id,
    ]);
    const result = await this.execute(query);
    if (result && result.length === 1) return result[0];
    return null;
  }

  async delete(id) {
    const query = mysql.format(`DELETE FROM ${this._tableName} WHERE id = ?`, [
      id,
    ]);
    const result = await this.execute(query);
    if (result && result.affectedRows === 1)
      return {
        entity: this._tableName,
        id,
        status: "deleted",
      };
    else return null;
  }
};
