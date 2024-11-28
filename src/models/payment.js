'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Order, {foreignKey: 'orderId', targetKey: 'id', as: 'order'})
    }
  }
  Payment.init({
    orderId: DataTypes.INTEGER,
    payment_type: DataTypes.STRING,
    transactionId: DataTypes.STRING,
    transactionDate: DataTypes.STRING,
    bank_code: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Payment',
    paranoid: true,
  });
  return Payment;
};