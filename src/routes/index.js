const restaurantRouter = require("./restaurant");
const authRouter = require("./auth");
const adminRouter = require("./admin");
const orderRouter = require("./order");
const tourRouter = require("./tour");
const route = (app) => {
    app.use("/api/restaurants", restaurantRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/admin", adminRouter);
    app.use("/api/tour", tourRouter);
    app.use("/api/order", orderRouter);
};

module.exports = route;
