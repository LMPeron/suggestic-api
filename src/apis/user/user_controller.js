const CRUDController = require("../../commons/crud_controller");
const UserRepository = require("./user_repository");
const JwtToken = require("../../utils/jwt_token");
const Encrypt = require("../../utils/encrypt");

module.exports = class UserController extends CRUDController {
  constructor() {
    super("user", new UserRepository());
  }

  async register(req, res) {
    try {
      const user = req.body;
      const hashedPassword = await Encrypt.hash(user.password);
      const existingUser = await this._repository.findByEmail(user.email);
      if (existingUser)
        throw { status: 400, message: "User already exists with this email." };
      const createdUser = await this._repository.create({
        ...user,
        password: hashedPassword,
      });
      const token = JwtToken.generateToken({ user: createdUser.id });
      return res.status(200).json({ user: { id: createdUser }, token: token });
    } catch (error) {
      console.error(error);
      return res
        .status(error.status ?? 500)
        .send(
          `Creating ${this._controllerName} failed. - ${error.message ?? ""}`
        );
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this._repository.findByEmail(email);
      await Encrypt.compare(password, user.password);
      const token = JwtToken.generateToken({ user: user.id });
      delete user.password, delete user.created_at, delete user.updated_at;
      return res.status(200).json({ user, token });
    } catch (error) {
      console.error(error);
      return res
        .status(error.status ?? 500)
        .send(`Login ${this._controllerName} failed.`);
    }
  }

  async renewToken(req, res) {
    try {
      const userId = req.user;
      const user = await this._repository.get(userId);
      const token = JwtToken.generateToken({ user: user.id });
      delete user.password;
      return res.status(200).json({ data: user, token });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send(`Renew token in ${this._controllerName} failed.`);
    }
  }
};
