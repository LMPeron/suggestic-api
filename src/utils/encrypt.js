const bcrypt = require("bcryptjs");

/**
 * Encrypt is a utility class that provides methods for encrypting data.
 */
module.exports = class Encrypt {
  /**
   * Hashes a value using bcrypt.
   * @param {string} value The value to be hashed.
   * @returns {Promise<string>} A promise that resolves to the hashed value.
   */
  static async hash(value, saltNumber = 10) {
    const salt = await bcrypt.genSalt(saltNumber);
    return bcrypt.hash(value, salt);
  }

  static async compare(value, hash) {
    if (!(await bcrypt.compare(value, hash)))
      throw { status: 401, message: "Invalid password" };
  }
};
