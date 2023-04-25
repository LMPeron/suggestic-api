// Import the necessary modules
const jwt = require("jsonwebtoken");
const { SECRET, TOKEN_DURATION } = process.env;

module.exports = class JwtToken {
  /**
   Creates a new JWT with the provided payload and options.
   @param {Object} payload The data to include in the JWT.
   @param {number|string} expiresIn The duration for which the JWT should be valid.
   @returns {string} The generated JWT.
  */
  static generateToken(payload, expiresIn = TOKEN_DURATION) {
    const options = { expiresIn, issuer: "suggestic" };
    return jwt.sign(payload, SECRET, options);
  }

  static validateToken(token) {
    return jwt.verify(token, SECRET, (err, decoded) => {
      if (err) throw { status: 401, message: "Invalid token" };
      if (decoded.iss !== "suggestic")
        throw { status: 401, message: "Invalid token" };

      return { user: decoded.user, jwtToken: token };
    });
  }
};
