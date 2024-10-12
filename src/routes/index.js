const restaurantRouter = require("./restaurant");
const authRouter = require("./auth");
const adminRouter = require("./admin");
const orderRouter = require("./order");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");
const tourRouter = require("./tour");
const route = (app) => {
    app.use("/api/restaurants", restaurantRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/admin", adminAuthMiddleware, adminRouter);
    app.use("/api/tour", tourRouter);
    app.use("/api/order", orderRouter);
};

module.exports = route;
