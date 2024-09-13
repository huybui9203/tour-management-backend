'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.belongsTo(models.Employee, { foreignKey: 'employee_id', targetKey: 'id', as: 'employee'})
      Account.belongsTo(models.Role, { foreignKey: 'role_id', targetKey: 'id', as: 'role'})
      Account.belongsTo(models.Customer, { foreignKey: 'cust_id', targetKey: 'id', as: 'customer'})
    }
  }
  Account.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    employee_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
    cust_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};