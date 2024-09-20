'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Employee, {foreignKey: 'employee_id', targetKey: 'id', as: 'employee'})
      Order.belongsTo(models.Customer, {foreignKey: 'cust_id', targetKey: 'id', as: 'customer'})
      Order.belongsTo(models.ListValues, {foreignKey: 'list_status_id', targetKey: 'list_id', as: 'list_status'})
      Order.belongsTo(models.ListValues, {foreignKey: 'status_id', targetKey: 'ele_id', as: 'status'})
      Order.belongsTo(models.TourDay, {foreignKey: 'tour_day_id', targetKey: 'id', as:'tour_day'})
      Order.hasMany(models.Participant, {foreignKey: 'order_id'})
    }
  }
  Order.init({
    total_price: DataTypes.FLOAT,
    deposit: DataTypes.FLOAT,
    order_date: DataTypes.DATE,
    number_of_people: DataTypes.INTEGER,
    children_count: DataTypes.INTEGER,
    adults_count: DataTypes.INTEGER,
    pay_date: DataTypes.DATE,
    rooms_count: DataTypes.INTEGER,
    rating: DataTypes.FLOAT,
    employee_id: DataTypes.INTEGER,
    cust_id: DataTypes.INTEGER,
    tour_day_id: DataTypes.INTEGER,
    list_status_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
    timestamps:true
  });
  return Order;
};