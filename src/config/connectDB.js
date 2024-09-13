require('dotenv').config()
const { Sequelize } = require('sequelize');
const {DB_HOST, DB_PASS, DB_USER, DB_DATABASE, DB_PORT} = process.env || {}

const sequelize = new Sequelize(`mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`)

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB