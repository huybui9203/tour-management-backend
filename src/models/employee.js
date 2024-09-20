"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Employee extends Model {
        static associate(models) {
            Employee.hasMany(models.Account, { foreignKey: "id" });
            Employee.hasMany(models.Order, { foreignKey: "id" });
        }
    }
    Employee.init(
        {
            name: DataTypes.STRING,
            position: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Employee",
        }
    );
    return Employee;
};
