"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CusFavorTour extends Model {
        static associate(models) {
            // define association here
        }
    }
    CusFavorTour.init(
        {
            cust_id: DataTypes.INTEGER,
            tour_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "CusFavorTour",
            timestamps: false,
        }
    );
    return CusFavorTour;
};
