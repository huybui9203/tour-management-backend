'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderStatus extends Model {
    static associate(models) {
      OrderStatus.hasMany(models.Order, {foreignKey: 'id'})
    }
  }
  OrderStatus.init({
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderStatus',
    timestamps: false,
  });
  return OrderStatus;
};