"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.belongsTo(models.Account, {foreignKey: 'acc_id', targetKey: 'id', as: 'account'})
      Customer.hasMany(models.Order, {foreignKey: 'cust_id'})
      Customer.belongsToMany(models.Tour, {through: models.CusFavorTour, foreignKey: 'cust_id', as: 'favor_tours'})
    }
  }
  Customer.init({
    name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    address: DataTypes.STRING,
    identity: DataTypes.STRING,
    age: DataTypes.INTEGER,
    acc_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Customer',
    timestamps:true
  });
  return Customer;
};
