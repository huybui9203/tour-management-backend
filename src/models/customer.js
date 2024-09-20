"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        static associate(models) {
            Customer.hasMany(models.Account, { foreignKey: "id" });
            Customer.hasMany(models.Account, { foreignKey: "id" });
            Customer.belongsToMany(models.Tour, {
                through: models.CusFavorTour,
                foreignKey: "cust_id",
                as: "favor_tours",
            });
        }
    }
    Customer.init(
        {
            name: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            address: DataTypes.STRING,
            identity: DataTypes.STRING,
            age: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Customer",
        }
    );
    return Customer;
};
