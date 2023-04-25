const Logger = require("../utils/logger");
const JwtToken = require("../utils/jwt_token");

module.exports = class AuthMiddleWare {
  constructor() {
    this._logger = new Logger(`authentication-middleware`).getLogger();
  }

  async checkAuthentication(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = this.validateAuthHeader(authHeader);
      const { user, jwtToken } = JwtToken.validateToken(token);
      req.user = user;
      req.jwt = jwtToken;
      return next();
    } catch (error) {
      this._logger.error(
        `Something went wrong while checking authentication - ${error}`
      );
      return res
        .status(error.status ?? 500)
        .send(`Something went wrong while checking authentication`);
    }
  }

  validateAuthHeader(authHeader) {
    if (!authHeader) throw { status: 401, message: "No token provided" };
    const parts = authHeader.split(" ");
    if (!parts.length === 2) throw { status: 401, message: "Token error" };
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme))
      throw { status: 401, message: "Wrong formatted token" };
    return token;
  }
};
