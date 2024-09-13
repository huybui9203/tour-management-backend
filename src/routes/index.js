const resRouter = require('./restaurant')

const route = (app) => {
    app.use('/restaurants', resRouter);

};

module.exports = route