'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Employee, {foreignKey: 'employee_id', targetKey: 'id', as: 'employee'})
      Order.belongsTo(models.Customer, {foreignKey: 'cust_id', targetKey: 'id', as: 'customer'})
      Order.belongsTo(models.OrderStatus, {foreignKey: 'status_id', targetKey: 'id', as: 'status'})
      Order.belongsTo(models.Tour, {foreignKey: 'tour_id', targetKey: 'id', as: 'tour'})
      Order.hasOne(models.Participant, {foreignKey: 'id'})
    }
  }
  Order.init({
    total_price: DataTypes.FLOAT,
    deposit: DataTypes.FLOAT,
    order_date: DataTypes.DATE,
    number_of_people: DataTypes.INTEGER,
    employee_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER,
    cust_id: DataTypes.INTEGER,
    tour_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};