"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        static associate(models) {
            Account.hasOne(models.Employee, { foreignKey: "acc_id" });
            Account.hasOne(models.Customer, { foreignKey: "acc_id" });
            Account.belongsTo(models.ListValues, { foreignKey: "list_role_id", targetKey: "list_id", as: "list_role" });
            Account.belongsTo(models.ListValues, { foreignKey: "role_id", targetKey: "ele_id", as: "role" });
        }
    }
    Account.init(
        {
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            email: DataTypes.STRING,
            list_role_id: DataTypes.INTEGER,
            role_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Account",
            timestamps: true,
        }
    );
    return Account;
};
