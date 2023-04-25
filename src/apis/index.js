const UserRoute = require("./user/user_route");
const ItemRoute = require("./item/item_route");

exports.setRoutes = (app) => {
  app.use("/api/v1.0/user", UserRoute.router);
  app.use("/api/v1.0/item", ItemRoute.router);
};
