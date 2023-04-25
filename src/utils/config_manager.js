/**
 *  Config manager provides loading all configurations when application is startup. Some configs gathered from environment variables,
 *  some are from static fields. When a modicifation needed, if you think, a variable is static please you should add it as static, not use ENVIRONMENT_VARIABLES!!!!
 */
module.exports = class ConfigManager {
  constructor() {
    this.mysql = this._getMysqlConfigs();
  }

  _getMysqlConfigs() {
    let mysql = {};
    mysql.database = process.env.ENTITY_SERVICE_MYSQL_DATABASE;
    mysql.connectionLimit =
      process.env.ENTITY_SERVICE_MYSQL_CONNECTION_LIMIT || 1000;
    mysql.queueLimit = process.env.ENTITY_SERVICE_MYSQL_QUEUE_LIMIT || 1000;
    mysql.host = process.env.ENTITY_SERVICE_MYSQL_HOST;
    mysql.port = process.env.ENTITY_SERVICE_MYSQL_PORT || 3306;
    mysql.user = process.env.ENTITY_SERVICE_MYSQL_USER;
    mysql.password = process.env.ENTITY_SERVICE_MYSQL_PASSWORD;
    mysql.timezone = "utc";
    return mysql;
  }

  getConfigurations() {
    return {
      mysql: this.mysql,
      logLevel: process.env.LOG_LEVEL || "debug",
      rejectUnauthorized:
        process.env.REQUEST_REJECT_UNAUTHORIZED == "true" ? true : false,
      listenPort: process.env.PORT || 8085,
    };
  }
};
