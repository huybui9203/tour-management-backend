'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    static associate(models) {
      Participant.belongsTo(models.Order, {foreignKey: 'order_id', targetKey: 'id', as: 'order'})
    }
  }
  Participant.init({
    number_of_adults: DataTypes.INTEGER,
    number_of_children: DataTypes.INTEGER,
    total_count: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Participant',
  });
  return Participant;
};