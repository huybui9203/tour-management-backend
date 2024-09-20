const restaurantRouter = require("./restaurant");
const authRouter = require("./auth");
const route = (app) => {
    app.use("/api/restaurants", restaurantRouter);
    app.use("/api/auth", authRouter);
};

module.exports = route;
