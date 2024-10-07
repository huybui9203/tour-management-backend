const restaurantRouter = require("./restaurant");
const authRouter = require("./auth");
const adminRouter = require('./admin')
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware')
const adminRouter = require('./admin')
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware')
const tourRouter = require("./tour");
const route = (app) => {
    app.use("/api/restaurants", restaurantRouter);
    app.use("/api/auth", authRouter);
    app.use('/api/admin', adminAuthMiddleware, adminRouter)
    app.use('/api/admin', adminAuthMiddleware, adminRouter)
    app.use("/api/tour", tourRouter);
};

module.exports = route;
