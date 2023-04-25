const express = require("express");
const ItemController = require("./item_controller.js");
const ItemValidator = require("./item_validator.js");
const AuthMiddleWare = require("../../commons/auth_middleware.js");
const authMiddleware = new AuthMiddleWare();
const ItemRouter = express.Router();
const itemController = new ItemController();
const itemValidator = new ItemValidator();

ItemRouter.route("/")
  .post(itemController.flattenItems.bind(itemController))
  .get(
    authMiddleware.checkAuthentication.bind(authMiddleware),
    itemController.getLastItemsHistoryByUser.bind(itemController)
  )
  .delete(
    authMiddleware.checkAuthentication.bind(authMiddleware),
    itemController.delete.bind(itemController)
  );

ItemRouter.route("/all").get(
  authMiddleware.checkAuthentication.bind(authMiddleware),
  itemController.getItemsHistoryByUser.bind(itemController)
);

ItemRouter.route("/save").post(
  authMiddleware.checkAuthentication.bind(authMiddleware),
  itemController.flattenItemsAndSave.bind(itemController)
);

ItemRouter.route("/:id").delete(
  authMiddleware.checkAuthentication.bind(authMiddleware),
  itemController.delete.bind(itemController)
);

module.exports = {
  router: ItemRouter,
};
