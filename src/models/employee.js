"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Account, {foreignKey: 'acc_id', targetKey: 'id', as: 'account'})
      Employee.hasMany(models.Order, {foreignKey: 'employee_id'})
    }
  }
  Employee.init({
    name: DataTypes.STRING,
    position: DataTypes.STRING,
    acc_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Employee',
    timestamps:true
  });
  return Employee;
};
