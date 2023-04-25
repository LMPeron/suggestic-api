const express = require("express");
const UserController = require("./user_controller.js");
const UserValidator = require("./user_validator.js");
const AuthMiddleWare = require("../../commons/auth_middleware.js");
const authMiddleWare = new AuthMiddleWare();
const UserRouter = express.Router();
const userController = new UserController();
const userValidator = new UserValidator();

UserRouter.route("/")
  .get(
    authMiddleWare.checkAuthentication.bind(authMiddleWare),
    userController.index.bind(userController)
  )
  .post(
    authMiddleWare.checkAuthentication.bind(authMiddleWare),
    userValidator.validate.bind(userValidator),
    userController.create.bind(userController)
  );

UserRouter.post(
  "/register",
  userValidator.validate.bind(userValidator),
  userController.register.bind(userController)
);

UserRouter.post(
  "/login",
  userValidator.validateLogin.bind(userValidator),
  userController.login.bind(userController)
);

UserRouter.post(
  "/renew-token",
  authMiddleWare.checkAuthentication.bind(authMiddleWare),
  userController.renewToken.bind(userController)
);

UserRouter.route("/:id")
  .get(userController.read.bind(userController))
  .put(
    userValidator.validate.bind(userValidator),
    userController.update.bind(userController)
  )
  .delete(userController.delete.bind(userController));

module.exports = {
  router: UserRouter,
};
