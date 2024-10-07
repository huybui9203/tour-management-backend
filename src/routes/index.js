const restaurantRouter = require("./restaurant");
const authRouter = require("./auth");
const tourRouter = require("./tour");
const route = (app) => {
    app.use("/api/restaurants", restaurantRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/tour", tourRouter);
};

module.exports = route;
